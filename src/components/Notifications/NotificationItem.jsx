import React, { useState } from 'react';
import { X, MapPin, Clock, Eye, EyeOff } from 'lucide-react';

const NotificationItem = ({
    notification,
    onClick,
    onRemove,
    getIcon
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRead, setIsRead] = useState(notification.read);

    const IconComponent = getIcon(notification.type);

    // Get priority color
    const getPriorityColor = (priority) => {
        const colors = {
            high: '#e74c3c',
            medium: '#f39c12',
            low: '#95a5a6'
        };
        return colors[priority] || '#95a5a6';
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleClick = () => {
        if (!isRead) {
            setIsRead(true);
        }
        if (onClick) {
            onClick(notification);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(notification.id);
        }
    };

    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        setIsRead(!isRead);
    };

    return (
        <div
            className={`notification-item ${isRead ? 'read' : 'unread'} ${notification.dismissed ? 'dismissed' : ''}`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Priority indicator */}
            <div
                className="priority-indicator"
                style={{ backgroundColor: getPriorityColor(notification.priority) }}
            />

            {/* Icon */}
            <div className="notification-icon">
                <IconComponent
                    size={16}
                    color={getPriorityColor(notification.priority)}
                />
            </div>

            {/* Content */}
            <div className="notification-content">
                <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">
                        <Clock size={12} />
                        {formatTimestamp(notification.timestamp)}
                    </span>
                </div>

                <p className="notification-message">{notification.message}</p>

                {notification.location && (
                    <div className="notification-location">
                        <MapPin size={12} />
                        <span>Location available</span>
                    </div>
                )}

                {/* Tags */}
                <div className="notification-tags">
                    <span
                        className="tag priority-tag"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                    >
                        {notification.priority}
                    </span>
                    <span className="tag type-tag">
                        {notification.type}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="notification-actions">
                {isHovered && (
                    <>
                        <button
                            className="action-btn"
                            onClick={handleMarkAsRead}
                            title={isRead ? "Mark as unread" : "Mark as read"}
                        >
                            {isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <button
                            className="action-btn remove-btn"
                            onClick={handleRemove}
                            title="Remove notification"
                        >
                            <X size={14} />
                        </button>
                    </>
                )}
            </div>

            {/* Read indicator */}
            {!isRead && <div className="unread-indicator" />}
        </div>
    );
};

export default NotificationItem;
