import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { DocumentForm } from './components/DocumentForm';
import { DocumentList } from './components/DocumentList';
import { UserList } from './components/UserList';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SettingsPage } from './components/settings/SettingsPage';
import { LogList } from './components/logs/LogList';
import { Document, User, Category, Notification, NotificationSettings, Log } from './types';
import { SidebarProvider } from './contexts/SidebarContext';
import dbService from './db';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    documents: true,
    userActivity: true,
    systemUpdates: true
  });

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setDocuments(dbService.getAllDocuments());
      setUsers(dbService.getAllUsers());
      setCategories(dbService.getAllCategories());
      setLogs(dbService.getAllLogs());
      const allNotifications = dbService.getAllNotifications();
      const userNotifications = currentUser.role === 'admin' 
        ? allNotifications 
        : allNotifications.filter(n => n.userId === currentUser.id);
      setNotifications(userNotifications);
    }
  }, [isAuthenticated, currentUser]);

  const addLog = (type: Log['type'], action: string, message: string, details?: string) => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      action,
      message,
      details,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    dbService.createLog(newLog);
    setLogs(prev => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    dbService.clearAllLogs();
    setLogs([]);
    addLog('info', 'Logs effacés', 'Tous les logs ont été effacés');
  };

  const handleDeleteLog = (id: string) => {
    dbService.deleteLog(id);
    setLogs(prev => prev.filter(log => log.id !== id));
    addLog('info', 'Log supprimé', `Le log ${id} a été supprimé`);
  };

  const addNotification = (type: 'document' | 'user' | 'system', title: string, message: string, userId: string) => {
    if (
      (type === 'document' && notificationSettings.documents) ||
      (type === 'user' && notificationSettings.userActivity) ||
      (type === 'system' && notificationSettings.systemUpdates)
    ) {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        createdBy: currentUser?.id || ''
      };
      setNotifications(prev => [newNotification, ...prev]);
      dbService.createNotification(newNotification);
    }
  };

  const handleLogin = (username: string, password: string) => {
    try {
      const user = dbService.getUserByCredentials(username, password);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        addNotification('user', 'Connexion', `${username} s'est connecté`, user.id);
        addLog('info', 'Connexion', `L'utilisateur ${username} s'est connecté`);
      } else {
        addLog('error', 'Échec de connexion', `Tentative de connexion échouée pour l'utilisateur ${username}`);
        throw new Error('Identifiants invalides');
      }
    } catch (error) {
      alert('Identifiants invalides');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog('info', 'Déconnexion', `L'utilisateur ${currentUser.username} s'est déconnecté`);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setDocuments([]);
    setUsers([]);
    setNotifications([]);
    setLogs([]);
  };

  const handleClearNotifications = () => {
    dbService.clearAllNotifications();
    setNotifications([]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    dbService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleUserSubmit = (userData: Partial<User>) => {
    try {
      if (!userData.id) {
        // Create new user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: userData.username || '',
          password: userData.password || '',
          email: userData.email || '',
          role: userData.role || 'user',
          profilePhoto: userData.profilePhoto,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: {
            documents: { view: true, create: false, edit: false, delete: false },
            users: { view: false, create: false, edit: false, delete: false },
            settings: { view: false, manage: false },
            dashboard: { view: false },
            logs: { view: false }
          }
        };
        dbService.createUser(newUser);
        setUsers(prev => [...prev, newUser]);
        addNotification('user', 'Nouvel utilisateur', `${newUser.username} a été créé`, newUser.id);
        addLog('info', 'Création d\'utilisateur', `L'utilisateur ${newUser.username} a été créé`);
      } else {
        // Update existing user
        const updatedUser = dbService.updateUser(userData);
        if (updatedUser) {
          setUsers(prev => prev.map(user => 
            user.id === userData.id ? updatedUser : user
          ));
          addNotification('user', 'Utilisateur modifié', `${updatedUser.username} a été modifié`, updatedUser.id);
          addLog('info', 'Modification d\'utilisateur', `L'utilisateur ${updatedUser.username} a été modifié`);
        }
      }
    } catch (error) {
      addLog('error', 'Erreur utilisateur', `Échec de l'opération sur l'utilisateur`, error instanceof Error ? error.message : undefined);
    }
  };

  const handleDeleteUser = (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        dbService.deleteUser(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
        addNotification('user', 'Utilisateur supprimé', `${user.username} a été supprimé`, userId);
        addLog('info', 'Suppression d\'utilisateur', `L'utilisateur ${user.username} a été supprimé`);
      }
    } catch (error) {
      addLog('error', 'Erreur de suppression', `Échec de la suppression de l'utilisateur ${userId}`, error instanceof Error ? error.message : undefined);
    }
  };

  const handleUpdatePermissions = (userId: string, permissions: User['permissions']) => {
    try {
      const updatedUser = dbService.updateUser({ id: userId, permissions });
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ));
        addNotification('user', 'Permissions modifiées', `Les permissions ont été mises à jour`, userId);
        addLog('info', 'Modification des permissions', `Les permissions de l'utilisateur ${updatedUser.username} ont été modifiées`);
      }
    } catch (error) {
      addLog('error', 'Erreur de permissions', `Échec de la modification des permissions pour l'utilisateur ${userId}`, error instanceof Error ? error.message : undefined);
    }
  };

  const handleAddCategory = (name: string) => {
    try {
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.toLowerCase(),
        createdAt: new Date().toISOString()
      };
      dbService.createCategory(newCategory);
      setCategories(prev => [...prev, newCategory]);
      addNotification('system', 'Nouvelle catégorie', `La catégorie ${name} a été créée`, currentUser?.id || '');
      addLog('info', 'Ajout de catégorie', `La catégorie ${name} a été créée`);
    } catch (error) {
      addLog('error', 'Erreur de catégorie', `Échec de l'ajout de la catégorie ${name}`, error instanceof Error ? error.message : undefined);
    }
  };

  const handleDeleteCategory = (id: string) => {
    try {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        dbService.deleteCategory(id);
        setCategories(prev => prev.filter(cat => cat.id !== id));
        addNotification('system', 'Catégorie supprimée', `Une catégorie a été supprimée`, currentUser?.id || '');
        addLog('info', 'Suppression de catégorie', `La catégorie ${category.name} a été supprimée`);
      }
    } catch (error) {
      addLog('error', 'Erreur de suppression', `Échec de la suppression de la catégorie ${id}`, error instanceof Error ? error.message : undefined);
    }
  };

  const handleUpdateProfile = (userData: Partial<User>) => {
    try {
      if (currentUser) {
        const updatedUser = dbService.updateUser({ ...userData, id: currentUser.id });
        if (updatedUser) {
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          ));
          addNotification('user', 'Profil mis à jour', `Le profil a été mis à jour`, currentUser.id);
          addLog('info', 'Mise à jour du profil', `Le profil de ${updatedUser.username} a été mis à jour`);
        }
      }
    } catch (error) {
      addLog('error', 'Erreur de profil', `Échec de la mise à jour du profil`, error instanceof Error ? error.message : undefined);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header 
            user={currentUser!}
            onLogout={handleLogout}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
          />
          <div className="flex pt-16">
            <Sidebar 
              isAdmin={currentUser?.role === 'admin'} 
              hasSettingsAccess={currentUser?.permissions.settings.view || false}
            />
            <main className="flex-1 p-4 lg:p-6">
              <Routes>
                <Route path="/" element={
                  currentUser?.permissions.dashboard.view ? (
                    <Dashboard 
                      documents={documents} 
                      users={users}
                      logs={logs}
                    />
                  ) : (
                    <Navigate to="/documents" replace />
                  )
                } />
                <Route
                  path="/documents"
                  element={
                    <DocumentList 
                      documents={documents}
                      onDeleteDocument={(id) => {
                        const doc = documents.find(d => d.id === id);
                        if (doc) {
                          dbService.deleteDocument(id);
                          setDocuments(prev => prev.filter(d => d.id !== id));
                          addNotification('document', 'Document supprimé', `${doc.name} a été supprimé`, currentUser!.id);
                          addLog('info', 'Suppression de document', `Le document "${doc.name}" a été supprimé`);
                        }
                      }}
                      onAddDocument={(name, date, category, file) => {
                        const newDocument: Document = {
                          id: Math.random().toString(36).substr(2, 9),
                          name,
                          date,
                          category,
                          file,
                          fileUrl: URL.createObjectURL(file),
                          fileType: file.type,
                          uploadDate: new Date().toISOString(),
                          userId: currentUser!.id
                        };
                        dbService.createDocument(newDocument);
                        setDocuments(prev => [...prev, newDocument]);
                        addNotification('document', 'Nouveau document', `${name} a été ajouté`, currentUser!.id);
                        addLog('info', 'Ajout de document', `Le document "${name}" a été ajouté`);
                      }}
                      currentUser={currentUser!}
                      categories={categories}
                    />
                  }
                />
                {(currentUser?.permissions.users.view || currentUser?.role === 'admin') && (
                  <Route
                    path="/users"
                    element={
                      <UserList
                        users={users}
                        onEditUser={handleUserSubmit}
                        onDeleteUser={handleDeleteUser}
                        onUpdatePermissions={handleUpdatePermissions}
                      />
                    }
                  />
                )}
                {(currentUser?.permissions.settings.view || currentUser?.role === 'admin') && (
                  <Route
                    path="/settings"
                    element={
                      <SettingsPage
                        categories={categories}
                        onAddCategory={handleAddCategory}
                        onDeleteCategory={handleDeleteCategory}
                        notificationSettings={notificationSettings}
                        onUpdateNotificationSettings={setNotificationSettings}
                        currentUser={currentUser!}
                        onUpdateProfile={handleUpdateProfile}
                      />
                    }
                  />
                )}
                {currentUser?.role === 'admin' && (
                  <Route
                    path="/logs"
                    element={
                      <LogList
                        logs={logs}
                        onClearLogs={handleClearLogs}
                        onDeleteLog={handleDeleteLog}
                      />
                    }
                  />
                )}
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;