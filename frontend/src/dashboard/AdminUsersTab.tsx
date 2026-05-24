import { useState } from 'react';
import { apiFetch } from './shared';

interface AdminUsersTabProps {
  data: { eleves: any[]; profs: any[]; parents: any[] };
  onRefresh: () => void;
}

export default function AdminUsersTab({ data, onRefresh }: AdminUsersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const allUsers = [
    ...data.eleves.map(u => ({ ...u, role: 'eleve' as const })),
    ...data.profs.map(u => ({ ...u, role: 'professeur' as const })),
    ...data.parents.map(u => ({ ...u, role: 'parent' as const })),
  ];

  const filteredUsers = allUsers.filter(u => 
    u.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteUser = async (role: string, id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch(`/admin/users/${role}/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-4">
      <input 
        type="text" 
        placeholder="Rechercher par nom ou email..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
      />
      <div className="dash-card-flat overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Nom</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Rôle</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{u.nom}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 capitalize">{u.role}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => deleteUser(u.role, u.id)} className="text-xs text-rose-400 hover:text-rose-600 font-medium">Supprimer</button>
                </td>
              </tr>
            ))}
            {!filteredUsers.length && <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Aucun utilisateur</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
