import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Notification {
    id: string;
    description: string;
    type: string;
    createdAt: string;
    recipientId?: string;
    senderId?: string;
    isRead?: boolean;
}

interface NotificationsProps {
    notifications: Notification[];
}

const Notifications = ({ notifications }: NotificationsProps) => {
    // Debug logging
    console.log("Notifications component received:", notifications);
    console.log("Notifications count:", notifications?.length);

    const getNotificationIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        
        // Success/Positive notifications (Green)
        if (["appointment", "appointment_assigned", "payment"].includes(lowerType)) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        
        // Warning notifications (Yellow)
        if (["reminder", "low_stock", "delayed_appointment"].includes(lowerType)) {
            return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        }
        
        // Urgent/Error notifications (Red)
        if (["urgent", "overdue_payment"].includes(lowerType)) {
            return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
        
        // Medical notifications (Purple)
        if (["prescription", "medication", "test_result", "health_tip"].includes(lowerType)) {
            return <Info className="h-5 w-5 text-purple-500" />;
        }
        
        // Default: Info notifications (Blue)
        return <Info className="h-5 w-5 text-blue-500" />;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

            if (diffInHours < 1) {
                return "Just now";
            } else if (diffInHours < 24) {
                return `${diffInHours}h ago`;
            } else if (diffInHours < 48) {
                return "Yesterday";
            } else {
                return date.toLocaleDateString();
            }
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Recently";
        }
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Recent Notifications</CardTitle>
                        {notifications && notifications.length > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                        View all
                    </a>
                </div>
            </CardHeader>
            <CardContent>
                {notifications && notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.slice(0, 5).map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                            >
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        {notification.description || "No description"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(notification.createdAt)}
                                    </p>
                                    {!notification.isRead && (
                                        <span className="inline-block mt-1 text-xs text-blue-600 font-medium">
                                            • Unread
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No notifications yet</p>
                        <p className="text-xs mt-1">You'll see notifications here when they arrive</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Notifications;
