import React, { useState, useMemo } from 'react';
import { Bell, X, Check, Trash2, Filter, AlertTriangle, Info, MapPin, Calendar, Tag, CloudRain } from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({
    notifications,
    onRemoveNotification,
    onNotificationClick,
    onMarkAllAsRead,
    onClearAll
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, high, medium, low
    const [showDismissed, setShowDismissed] = useState(false);

    // Get icon for notification type
    const getNotificationIcon = (type) => {
        const icons = {
            weather: CloudRain,
            travel: MapPin,
            festival: Calendar,
            offer: Tag,
            emergency: AlertTriangle,
            info: Info
        };
        return icons[type] || Info;
    };

    // Filter notifications based on current filter
    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        // Filter by read status
        if (filter === 'unread') {
            filtered = filtered.filter(notification => !notification.read);
        } else if (filter === 'high') {
            filtered = filtered.filter(notification => notification.priority === 'high');
        } else if (filter === 'medium') {
            filtered = filtered.filter(notification => notification.priority === 'medium');
        } else if (filter === 'low') {
            filtered = filtered.filter(notification => notification.priority === 'low');
        }

        // Filter by dismissed status
        if (!showDismissed) {
            filtered = filtered.filter(notification => !notification.dismissed);
        }

        return filtered;
    }, [notifications, filter, showDismissed]);

    // Calculate unread count
    const unreadCount = useMemo(() => {
        return notifications.filter(notification => !notification.read && !notification.dismissed).length;
    }, [notifications]);

    // Get priority counts
    const priorityCounts = useMemo(() => {
        const counts = { high: 0, medium: 0, low: 0 };
        notifications.forEach(notification => {
            if (!notification.dismissed) {
                counts[notification.priority]++;
            }
        });
        return counts;
    }, [notifications]);

    const handleNotificationClick = (notification) => {
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
    };

    const handleRemoveNotification = (id) => {
        if (onRemoveNotification) {
            onRemoveNotification(id);
        }
    };

    const handleMarkAllAsRead = () => {
        if (onMarkAllAsRead) {
            onMarkAllAsRead();
        }
    };

    const handleClearAll = () => {
        if (onClearAll) {
            onClearAll();
        }
    };

    return (
        <div className={`notification-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {/* Header */}
            <div className="notification-header">
                <div className="notification-title">
                    <Bell size={20} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>

                <div className="notification-actions">
                    {unreadCount > 0 && (
                        <button
                            className="action-btn"
                            onClick={handleMarkAllAsRead}
                            title="Mark all as read"
                        >
                            <Check size={16} />
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            className="action-btn"
                            onClick={handleClearAll}
                            title="Clear all"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <button
                        className="action-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            {isExpanded && (
                <div className="notification-filters">
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
                            onClick={() => setFilter('high')}
                        >
                            High ({priorityCounts.high})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
                            onClick={() => setFilter('medium')}
                        >
                            Medium ({priorityCounts.medium})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
                            onClick={() => setFilter('low')}
                        >
                            Low ({priorityCounts.low})
                        </button>
                    </div>

                    <div className="filter-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={showDismissed}
                                onChange={(e) => setShowDismissed(e.target.checked)}
                            />
                            Show dismissed
                        </label>
                    </div>
                </div>
            )}

            {/* Notifications List */}
            {isExpanded && (
                <div className="notifications-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="no-notifications">
                            <Bell size={32} />
                            <p>No notifications to show</p>
                            <small>Try adjusting your filters</small>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleNotificationClick(notification)}
                                onRemove={() => handleRemoveNotification(notification.id)}
                                getIcon={getNotificationIcon}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Quick Stats */}
            {isExpanded && notifications.length > 0 && (
                <div className="notification-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">{notifications.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Unread:</span>
                        <span className="stat-value">{unreadCount}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">High Priority:</span>
                        <span className="stat-value">{priorityCounts.high}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
