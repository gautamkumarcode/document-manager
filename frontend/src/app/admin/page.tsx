"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStats, statsService } from "@/services/stats";
import { FileText, FolderTree, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getDashboardStats();
        setStats((response as any).data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Documents",
      value: stats?.counts.documents || 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Users",
      value: stats?.counts.users || 0,
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "Categories",
      value: stats?.counts.categories || 0,
      icon: FolderTree,
      color: "text-purple-500",
    },
    // Excluding Active Sessions for now as backend sends 0
    // {
    //   title: "Active Sessions",
    //   value: stats?.counts.activeSessions || 0,
    //   icon: Activity,
    //   color: "text-orange-500",
    // },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentDocuments && stats.recentDocuments.length > 0 ? (
                      stats.recentDocuments.map((doc) => (
                        <TableRow key={doc._id}>
                          <TableCell className="font-medium min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-500" />
                              {doc.title}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                             {typeof doc.category === 'object' && doc.category && 'name' in doc.category
                              ? (doc.category as any).name 
                              : doc.category || "-"}
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                             {typeof doc.uploadedBy === 'object' && doc.uploadedBy && 'name' in doc.uploadedBy
                              ? (doc.uploadedBy as any).name
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="min-w-[100px]">{formatDate(doc.createdAt || doc.uploadedAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No recent documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
