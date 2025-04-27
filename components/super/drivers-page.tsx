"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search, Truck } from "lucide-react"

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
import { DriverDetailsModal } from "./driver-details-modal"
import { toast } from "@/components/ui/use-toast"

const initialDrivers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    status: "active",
    deliveries: 245,
    rating: 4.8,
    earnings: "$3,450",
    joinDate: "Jan 15, 2023",
    vehicle: "Car - Toyota Camry",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 (555) 234-5678",
    location: "Chicago, IL",
    status: "active",
    deliveries: 189,
    rating: 4.7,
    earnings: "$2,890",
    joinDate: "Feb 3, 2023",
    vehicle: "Scooter - Vespa",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 345-6789",
    location: "Los Angeles, CA",
    status: "on_delivery",
    deliveries: 312,
    rating: 4.9,
    earnings: "$4,120",
    joinDate: "Mar 22, 2023",
    vehicle: "Car - Honda Civic",
  },
  {
    id: 4,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    status: "inactive",
    deliveries: 87,
    rating: 4.2,
    earnings: "$1,230",
    joinDate: "Apr 10, 2023",
    vehicle: "Bicycle",
  },
  {
    id: 5,
    name: "Tony Romano",
    email: "tony.romano@example.com",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    status: "active",
    deliveries: 156,
    rating: 4.6,
    earnings: "$2,340",
    joinDate: "May 5, 2023",
    vehicle: "Car - Ford Focus",
  },
  {
    id: 6,
    name: "Carlos Mendez",
    email: "carlos.mendez@example.com",
    phone: "+1 (555) 678-9012",
    location: "Austin, TX",
    status: "pending",
    deliveries: 0,
    rating: 0,
    earnings: "$0",
    joinDate: "Jun 18, 2023",
    vehicle: "Motorcycle - Yamaha",
  },
  {
    id: 7,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+1 (555) 789-0123",
    location: "San Francisco, CA",
    status: "on_delivery",
    deliveries: 203,
    rating: 4.5,
    earnings: "$2,780",
    joinDate: "Jul 7, 2023",
    vehicle: "Car - Tesla Model 3",
  },
  {
    id: 8,
    name: "Liu Wei",
    email: "liu.wei@example.com",
    phone: "+1 (555) 890-1234",
    location: "Portland, OR",
    status: "active",
    deliveries: 178,
    rating: 4.7,
    earnings: "$2,560",
    joinDate: "Aug 12, 2023",
    vehicle: "Car - Nissan Leaf",
  },
]

export function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)

  const handleViewDetails = (driver: any) => {
    setSelectedDriver(driver)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setDrivers(drivers.map((driver) => (driver.id === id ? { ...driver, status: newStatus } : driver)))

    toast({
      title: "Driver status updated",
      description: `Driver status has been updated to ${newStatus.replace("_", " ")}`,
    })
  }

  const activeDrivers = drivers.filter((d) => d.status === "active" || d.status === "on_delivery").length
  const inactiveDrivers = drivers.filter((d) => d.status === "inactive").length
  const pendingDrivers = drivers.filter((d) => d.status === "pending").length
  const totalDeliveries = drivers.reduce((acc, d) => acc + d.deliveries, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <p className="text-muted-foreground">Manage all delivery drivers in the system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeDrivers} active, {inactiveDrivers} inactive, {pendingDrivers} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                drivers.filter((d) => d.status !== "pending").reduce((acc, d) => acc + d.rating, 0) /
                drivers.filter((d) => d.status !== "pending").length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.filter((d) => d.status === "on_delivery").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently delivering orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Drivers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on_delivery">On Delivery</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search drivers..." className="w-full pl-8 bg-background" />
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
                <DropdownMenuLabel>Vehicle Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Car</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Motorcycle</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Scooter</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Bicycle</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>4.5+</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>4.0+</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>3.5+</DropdownMenuCheckboxItem>
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
            <CardTitle>All Drivers</CardTitle>
            <CardDescription>Showing {drivers.length} drivers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Deliveries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-xs text-muted-foreground">{driver.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{driver.location}</TableCell>
                    <TableCell className="hidden lg:table-cell">{driver.vehicle}</TableCell>
                    <TableCell>
                      {driver.status !== "pending" ? (
                        <div className="flex items-center">
                          {driver.rating}
                          <span className="text-amber-500 ml-1">★</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {driver.status !== "pending" ? driver.deliveries : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DriverStatus status={driver.status} />
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(driver)}>View details</DropdownMenuItem>
                          {driver.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "active")}>
                              Approve driver
                            </DropdownMenuItem>
                          )}
                          {driver.status === "active" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "inactive")}>
                              Deactivate driver
                            </DropdownMenuItem>
                          )}
                          {driver.status === "inactive" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "active")}>
                              Activate driver
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Contact driver</DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500">Remove driver</DropdownMenuItem>
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

      {selectedDriver && (
        <DriverDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          driver={selectedDriver}
          onStatusUpdate={(id, status) => handleUpdateStatus(id, status)}
        />
      )}
    </div>
  )
}

function DriverStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active" && "border-emerald-500 text-emerald-500",
        status === "on_delivery" && "border-blue-500 text-blue-500",
        status === "pending" && "border-amber-500 text-amber-500",
        status === "inactive" && "border-slate-500 text-slate-500",
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default DriversPage
