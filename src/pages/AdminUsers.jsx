import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';
const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

// ─── Helpers ───────────────────────────────────────────────────────────────

const ROLES = ['user', 'admin', 'superadmin'];

const ROLE_STYLES = {
    superadmin: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    admin:      'bg-violet-500/15 text-violet-400 border border-violet-500/30',
    user:       'bg-white/5 text-gray-400 border border-white/10',
};

const ROLE_LABELS = {
    superadmin: '⭐ Superadmin',
    admin:      '🛡️ Admin',
    user:       '👤 Usuario',
};

// Nota: el modelo no tiene campo "blocked", lo simulamos localmente
// hasta que agregues ese campo al backend.
const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};

// ─── Modal de detalle de usuario ───────────────────────────────────────────

const UserModal = ({ user, onClose, onRoleChange, onDelete }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [saving, setSaving] = useState(false);

    const handleRoleChange = async () => {
        if (selectedRole === user.role) return;
        setSaving(true);
        await onRoleChange(user._id, selectedRole);
        setSaving(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con foto */}
                <div className="relative h-24 bg-gradient-to-br from-violet-900/40 to-neutral-900">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white text-lg transition-colors"
                    >✕</button>
                    <img
                        src={user.profilePic?.startsWith('http')
                            ? user.profilePic 
                            : `${API_URL_FILES}/uploads/profiles/${user.profilePic}`
                            }
                        alt={user.name}
                        className="absolute -bottom-8 left-6 w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shadow-xl"
                        onError={(e) => { e.target.src = 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'; }}
                    />
                </div>

                <div className="pt-12 px-6 pb-6 space-y-5">
                    {/* Info principal */}
                    <div>
                        <h3 className="text-xl font-black text-white">{user.name} {user.surname}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${ROLE_STYLES[user.role]}`}>
                                {ROLE_LABELS[user.role]}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${user.verifiedEmail ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                                {user.verifiedEmail ? '✓ Verificado' : '✗ Sin verificar'}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-900 rounded-xl p-3 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Registro</p>
                            <p className="text-sm font-bold text-white">{formatDate(user.createdAt)}</p>
                        </div>
                        <div className="bg-neutral-900 rounded-xl p-3 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Favoritos</p>
                            <p className="text-sm font-bold text-white">{user.favorites?.length ?? 0} canciones</p>
                        </div>
                    </div>

                    {/* Favoritos */}
                    {user.favorites?.length > 0 && (
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">IDs Favoritos</p>
                            <div className="bg-neutral-900 rounded-xl p-3 border border-white/5 max-h-24 overflow-y-auto space-y-1">
                                {user.favorites.map((fav, i) => (
                                    <p key={i} className="text-xs text-gray-400 font-mono truncate">{fav}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cambiar rol */}
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Cambiar Rol</p>
                        <div className="flex gap-2">
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all capitalize ${
                                        selectedRole === role
                                            ? 'bg-violet-600 border-violet-500 text-white'
                                            : 'bg-neutral-900 border-white/10 text-gray-400 hover:border-white/30'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                        {selectedRole !== user.role && (
                            <button
                                onClick={handleRoleChange}
                                disabled={saving}
                                className="w-full mt-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : `Guardar → ${selectedRole}`}
                            </button>
                        )}
                    </div>

                    {/* Acciones peligrosas */}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                        <button
                            onClick={() => onDelete(user._id, onClose)}
                            className="flex-1 py-2 text-xs font-bold border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                            🗑️ Eliminar usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ──────────────────────────────────────────────────

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await musicApi.get('/users');
            setUsers(res.data.data.users);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'No se pudo cargar los usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            await musicApi.patch(`/users/${id}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
            if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, role: newRole }));
            Swal.fire('¡Listo!', `Rol actualizado a ${newRole}`, 'success');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'No se pudo cambiar el rol', 'error');
        }
    };

    const handleDelete = async (id, onClose) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!confirm.isConfirmed) return;
        try {
            await musicApi.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            onClose?.();
            Swal.fire('Eliminado', 'El usuario fue eliminado.', 'success');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al eliminar', 'error');
        }
    };

    const toggleBlock = async (id) => {
        try {
            const res = await musicApi.patch(`/users/${id}/block`);
            const { blocked } = res.data.data;
            setUsers(prev => prev.map(u => u._id === id ? { ...u, blocked } : u));
            Swal.fire(
                blocked ? '🔒 Bloqueado' : '✅ Desbloqueado',
                res.data.message,
                'success'
            );
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al cambiar estado', 'error');
        }
    };

    // ── Filtros
    const filtered = users.filter(u => {
        const matchSearch =
            `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'all' || u.role === filterRole;
        return matchSearch && matchRole;
    });

    // ── Stats
    const stats = {
        total: users.length,
        superadmin: users.filter(u => u.role === 'superadmin').length,
        admin: users.filter(u => u.role === 'admin').length,
        user: users.filter(u => u.role === 'user').length,
        blocked: users.filter(u => u.blocked).length,
        verified: users.filter(u => u.verifiedEmail).length,
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-8">

            {/* Nav */}
            <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
                <Link to="/" className="text-gray-500 hover:text-violet-400 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    ← Inicio
                </Link>
                <span className="text-white/10">|</span>
                <Link to="/admin" className="text-gray-500 hover:text-violet-400 text-[10px] font-bold uppercase tracking-widest transition-colors">
                    Panel Canciones
                </Link>
            </div>

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black mb-2">Usuarios</h1>
                <p className="text-gray-500 text-sm mb-8">Gestioná roles, accesos y estado de los usuarios registrados.</p>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'Superadmin', value: stats.superadmin, color: 'text-yellow-400' },
                        { label: 'Admin', value: stats.admin, color: 'text-violet-400' },
                        { label: 'Usuarios', value: stats.user, color: 'text-gray-300' },
                        { label: 'Verificados', value: stats.verified, color: 'text-green-400' },
                        { label: 'Bloqueados', value: stats.blocked, color: 'text-red-400' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-neutral-900 rounded-xl p-4 border border-white/5 text-center">
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none transition-colors"
                    />
                    <div className="flex gap-2">
                        {['all', 'user', 'admin', 'superadmin'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                                    filterRole === role
                                        ? 'bg-violet-600 border-violet-500 text-white'
                                        : 'bg-neutral-900 border-white/10 text-gray-500 hover:border-white/30'
                                }`}
                            >
                                {role === 'all' ? 'Todos' : role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla de usuarios */}
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-600">
                        <div className="text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-sm">Cargando usuarios...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.length === 0 && (
                            <p className="text-center text-gray-600 py-16 text-sm">No se encontraron usuarios.</p>
                        )}
                        {filtered.map((user) => {
                            const isBlocked = user.blocked
                            return (
                                <div
                                    key={user._id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                        isBlocked
                                            ? 'bg-red-950/20 border-red-500/20 opacity-60'
                                            : 'bg-neutral-900/60 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <img
                                        src={user.profilePic?.startsWith('http')
                                            ? user.profilePic 
                                            : `${API_URL_FILES}/uploads/profiles/${user.profilePic}`
                                            }
                                        alt={user.name}
                                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10"
                                        onError={(e) => { e.target.src = 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'; }}
                                    />

                                    {/* Info */}
                                    <div className="grow min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-sm truncate">
                                                {user.name} {user.surname}
                                            </span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ROLE_STYLES[user.role]}`}>
                                                {user.role}
                                            </span>
                                            {!user.verifiedEmail && (
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
                                                    sin verificar
                                                </span>
                                            )}
                                            {isBlocked && (
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                                                    bloqueado
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {user.email} <span className="text-gray-700">·</span> Desde {formatDate(user.createdAt)}
                                        </p>
                                    </div>

                                    {/* Favoritos */}
                                    <div className="hidden md:block text-center flex-shrink-0 w-16">
                                        <p className="text-sm font-black text-white">{user.favorites?.length ?? 0}</p>
                                        <p className="text-[9px] text-gray-600 uppercase">favs</p>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="px-3 py-2 text-[10px] font-black border border-white/10 hover:bg-white hover:text-black rounded-lg transition-all"
                                        >
                                            VER
                                        </button>
                                        <button
                                            onClick={() => toggleBlock(user._id)}
                                            className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all border ${
                                                isBlocked
                                                    ? 'border-green-500/50 text-green-500 hover:bg-green-500 hover:text-white'
                                                    : 'border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white'
                                            }`}
                                        >
                                            {isBlocked ? 'ACTIVAR' : 'BLOQUEAR'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="px-3 py-2 text-[10px] font-black border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                        >
                                            ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default AdminUsers;
