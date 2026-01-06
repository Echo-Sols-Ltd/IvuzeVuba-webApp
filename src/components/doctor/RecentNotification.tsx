"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, UserCheck, AlertTriangle, Info } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders, STORAGE_KEYS } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  description: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  senderId?: string;
}

const RecentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!userId) return;

        const response = await fetch(API_ENDPOINTS.DOCTOR.NOTIFICATIONS(userId), {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          // Get the 5 most recent notifications
          setNotifications(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'referral':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'general':
        return <Info className="h-4 w-4 text-gray-500" />;
      case 'delayed_appointment':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'overdue_payment':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(API_ENDPOINTS.DOCTOR.MARK_NOTIFICATION_READ(notificationId), {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          Recent Notifications
        </h2>
        <button className="text-sm text-[#118CDB] hover:underline">
          View all
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No recent notifications</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {notification.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentNotifications;
