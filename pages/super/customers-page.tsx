"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerDetailsModal } from "../../components/super/customer-details-modal"
import { toast } from "@/components/ui/use-toast"

const initialCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    status: "active",
    orders: 32,
    totalSpent: "$1,245.80",
    joinDate: "Jan 15, 2023",
    lastOrder: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    status: "active",
    orders: 18,
    totalSpent: "$876.50",
    joinDate: "Feb 3, 2023",
    lastOrder: "1 week ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "active",
    orders: 27,
    totalSpent: "$1,032.75",
    joinDate: "Mar 22, 2023",
    lastOrder: "3 days ago",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    status: "inactive",
    orders: 12,
    totalSpent: "$543.20",
    joinDate: "Apr 10, 2023",
    lastOrder: "2 months ago",
  },
  {
    id: 5,
    name: "Jessica Patel",
    email: "jessica.patel@example.com",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    status: "active",
    orders: 21,
    totalSpent: "$892.30",
    joinDate: "May 5, 2023",
    lastOrder: "5 days ago",
  },
  {
    id: 6,
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    status: "active",
    orders: 15,
    totalSpent: "$678.40",
    joinDate: "Jun 18, 2023",
    lastOrder: "1 day ago",
  },
  {
    id: 7,
    name: "Lisa Thompson",
    email: "lisa.thompson@example.com",
    phone: "+1 (555) 789-0123",
    location: "Austin, TX",
    status: "inactive",
    orders: 8,
    totalSpent: "$321.60",
    joinDate: "Jul 7, 2023",
    lastOrder: "3 months ago",
  },
  {
    id: 8,
    name: "James Martinez",
    email: "james.martinez@example.com",
    phone: "+1 (555) 890-1234",
    location: "Denver, CO",
    status: "active",
    orders: 24,
    totalSpent: "$945.70",
    joinDate: "Aug 12, 2023",
    lastOrder: "4 days ago",
  },
]

export function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setCustomers(customers.map((customer) => (customer.id === id ? { ...customer, status: newStatus } : customer)))

    toast({
      title: "Customer status updated",
      description: `Customer status has been updated to ${newStatus}`,
    })
  }

  const activeCustomers = customers.filter((c) => c.status === "active").length
  const inactiveCustomers = customers.filter((c) => c.status === "inactive").length
  const totalOrders = customers.reduce((acc, c) => acc + c.orders, 0)
  const totalSpent = customers.reduce(
    (acc, c) => acc + Number.parseFloat(c.totalSpent.replace("$", "").replace(",", "")),
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage all customers in the system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCustomers} active, {inactiveCustomers} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalOrders / customers.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders per customer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime customer value</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search customers..." className="w-full pl-8 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>New York</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>California</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Illinois</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Texas</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Join Date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Last 30 days</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Last 90 days</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Last year</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Showing {customers.length} customers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Orders</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{customer.location}</TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.orders}</TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.totalSpent}</TableCell>
                    <TableCell>
                      <CustomerStatus status={customer.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{customer.lastOrder}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>View details</DropdownMenuItem>
                          {customer.status === "active" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, "inactive")}>
                              Deactivate customer
                            </DropdownMenuItem>
                          )}
                          {customer.status === "inactive" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, "active")}>
                              Activate customer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View orders</DropdownMenuItem>
                          <DropdownMenuItem>Send message</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          customer={selectedCustomer}
          onStatusUpdate={(id, status) => handleUpdateStatus(id, status)}
        />
      )}
    </div>
  )
}

function CustomerStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active" && "border-emerald-500 text-emerald-500",
        status === "inactive" && "border-slate-500 text-slate-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default CustomersPage
