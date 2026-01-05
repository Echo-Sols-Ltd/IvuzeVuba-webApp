"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StaffTabsProps {
  staffContent: React.ReactNode;
  departmentContent: React.ReactNode;
  onAddUser?: () => void;
}

export default function StaffTabs({ 
  staffContent, 
  departmentContent, 
  onAddUser 
}: StaffTabsProps) {
  const [activeTab, setActiveTab] = useState("staff");

  return (
    <Tabs 
      defaultValue="staff" 
      className="w-full space-y-4"
      onValueChange={setActiveTab}
    >
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="staff">Staff directory</TabsTrigger>
          <TabsTrigger value="department">Department management</TabsTrigger>
        </TabsList>
        
        {activeTab === "staff" && onAddUser && (
          <Button 
            onClick={onAddUser}
            className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <TabsContent value="staff" className="mt-0">
        {staffContent}
      </TabsContent>

      <TabsContent value="department" className="mt-0">
        {departmentContent}
      </TabsContent>
    </Tabs>
  );
}
