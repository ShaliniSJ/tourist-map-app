import { useState, useCallback, useEffect } from 'react';

// Notification types and their configurations
export const notificationTypes = {
  weather: { 
    priority: 'high', 
    icon: 'CloudRain', 
    color: '#3498db',
    title: 'Weather Alert'
  },
  travel: { 
    priority: 'medium', 
    icon: 'MapPin', 
    color: '#e74c3c',
    title: 'Travel Update'
  },
  festival: { 
    priority: 'low', 
    icon: 'Calendar', 
    color: '#f39c12',
    title: 'Festival Alert'
  },
  offer: { 
    priority: 'medium', 
    icon: 'Tag', 
    color: '#27ae60',
    title: 'Special Offer'
  },
  emergency: { 
    priority: 'high', 
    icon: 'AlertTriangle', 
    color: '#e74c3c',
    title: 'Emergency Alert'
  },
  info: { 
    priority: 'low', 
    icon: 'Info', 
    color: '#95a5a6',
    title: 'Information'
  }
};

/**
 * Custom hook for managing notifications
 * @returns {Object} Notification state and operations
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: notification.id || Date.now() + Math.random(),
      type: notification.type || 'info',
      priority: notification.priority || 'medium',
      title: notification.title || 'Notification',
      message: notification.message || '',
      location: notification.location || null,
      timestamp: notification.timestamp || new Date(),
      read: false,
      dismissed: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-dismiss low priority notifications after 10 seconds
    if (newNotification.priority === 'low') {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, 10000);
    }
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Dismiss a notification (mark as dismissed but keep in list)
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, dismissed: true }
          : notification
      )
    );
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear dismissed notifications
  const clearDismissedNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(notification => !notification.dismissed));
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Get notifications by priority
  const getNotificationsByPriority = useCallback((priority) => {
    return notifications.filter(notification => notification.priority === priority);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Get active notifications (not dismissed)
  const getActiveNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.dismissed);
  }, [notifications]);

  // Sort notifications by priority and timestamp
  const getSortedNotifications = useCallback(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return [...notifications].sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by timestamp (newest first)
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }, [notifications]);

  // Generate sample notifications for demo
  const generateSampleNotifications = useCallback(() => {
    const sampleNotifications = [
      {
        type: 'weather',
        priority: 'high',
        title: 'Monsoon Alert',
        message: 'Heavy rainfall expected in Mumbai region. Plan your travel accordingly.',
        location: [72.8347, 18.9220]
      },
      {
        type: 'festival',
        priority: 'medium',
        title: 'Diwali Celebrations',
        message: 'Special events and decorations at major tourist spots in Delhi.',
        location: [77.2410, 28.6562]
      },
      {
        type: 'offer',
        priority: 'medium',
        title: 'Hotel Discount',
        message: '50% off on hotel bookings in Rajasthan for the next 7 days.',
        location: [75.8267, 26.9239]
      },
      {
        type: 'travel',
        priority: 'low',
        title: 'Road Closure',
        message: 'Temporary road closure on NH-1 near Amritsar for maintenance.',
        location: [74.8765, 31.6200]
      },
      {
        type: 'info',
        priority: 'low',
        title: 'New Attraction',
        message: 'New heritage walk route added in Old Delhi. Check it out!',
        location: [77.2410, 28.6562]
      }
    ];

    sampleNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 2000); // Stagger notifications
    });
  }, [addNotification]);

  // Auto-generate notifications based on tourist activity
  const generateActivityNotifications = useCallback((touristSpots, selectedHexagon) => {
    if (!touristSpots || touristSpots.length === 0) return;

    // Generate notifications based on tourist spot density
    const highDensitySpots = touristSpots.filter(spot => spot.rating >= 4.5);
    
    if (highDensitySpots.length > 0 && Math.random() < 0.3) {
      const randomSpot = highDensitySpots[Math.floor(Math.random() * highDensitySpots.length)];
      
      addNotification({
        type: 'travel',
        priority: 'medium',
        title: 'Popular Destination',
        message: `${randomSpot.name} is currently trending with high visitor activity.`,
        location: randomSpot.coords
      });
    }

    // Generate weather notifications for different regions
    const regions = [...new Set(touristSpots.map(spot => spot.region))];
    regions.forEach(region => {
      if (Math.random() < 0.2) {
        const regionSpots = touristSpots.filter(spot => spot.region === region);
        const randomSpot = regionSpots[Math.floor(Math.random() * regionSpots.length)];
        
        addNotification({
          type: 'weather',
          priority: 'medium',
          title: 'Regional Weather Update',
          message: `Pleasant weather conditions in ${region} region. Perfect for sightseeing!`,
          location: randomSpot.coords
        });
      }
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearDismissedNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    getActiveNotifications,
    getSortedNotifications,
    generateSampleNotifications,
    generateActivityNotifications
  };
};
