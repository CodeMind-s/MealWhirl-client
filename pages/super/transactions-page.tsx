"use client"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react"

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

const transactions = [
  {
    id: "TRX-001",
    orderId: "ORD-001",
    customer: "Sarah Johnson",
    amount: "$86.24",
    status: "completed",
    date: "Today, 2:30 PM",
    method: "Credit Card",
    type: "income",
  },
  {
    id: "TRX-002",
    orderId: "ORD-002",
    customer: "Michael Chen",
    amount: "$53.00",
    status: "pending",
    date: "Today, 2:15 PM",
    method: "Cash",
    type: "income",
  },
  {
    id: "TRX-003",
    orderId: "ORD-003",
    customer: "Emily Rodriguez",
    amount: "$124.00",
    status: "completed",
    date: "Today, 1:45 PM",
    method: "Credit Card",
    type: "income",
  },
  {
    id: "TRX-004",
    orderId: "ORD-004",
    customer: "David Kim",
    amount: "$58.24",
    status: "completed",
    date: "Today, 1:30 PM",
    method: "PayPal",
    type: "income",
  },
  {
    id: "TRX-005",
    orderId: "ORD-005",
    customer: "Jessica Patel",
    amount: "$27.49",
    status: "refunded",
    date: "Today, 1:00 PM",
    method: "Credit Card",
    type: "expense",
  },
  {
    id: "TRX-006",
    orderId: "ORD-006",
    customer: "Robert Wilson",
    amount: "$124.75",
    status: "completed",
    date: "Today, 12:30 PM",
    method: "Cash",
    type: "income",
  },
  {
    id: "TRX-007",
    orderId: "VENDOR-001",
    customer: "Fresh Produce Supplier",
    amount: "$450.00",
    status: "completed",
    date: "Today, 10:15 AM",
    method: "Bank Transfer",
    type: "expense",
  },
  {
    id: "TRX-008",
    orderId: "VENDOR-002",
    customer: "Wine Distributor",
    amount: "$875.50",
    status: "completed",
    date: "Yesterday, 3:45 PM",
    method: "Bank Transfer",
    type: "expense",
  },
]

export function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Track all financial transactions for your restaurant.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,546.00</div>
            <p className="text-xs text-muted-foreground mt-1">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowDown className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,264.50</div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,281.50</div>
            <p className="text-xs text-muted-foreground mt-1">+22.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground mt-1">3 pending transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search transactions..." className="w-full pl-8 bg-background" />
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
                <DropdownMenuCheckboxItem checked>Today</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>This Week</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>This Month</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Refunded</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Showing {transactions.length} transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order/Vendor</TableHead>
                  <TableHead className="hidden md:table-cell">Customer/Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.customer}</TableCell>
                    <TableCell className={transaction.type === "expense" ? "text-rose-500" : "text-emerald-500"}>
                      {transaction.type === "expense" ? "-" : "+"}
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.method}</TableCell>
                    <TableCell>
                      <TransactionStatus status={transaction.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Print receipt</DropdownMenuItem>
                          {transaction.status !== "refunded" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-rose-500">Process refund</DropdownMenuItem>
                            </>
                          )}
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>8</strong> of <strong>24</strong> transactions
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function TransactionStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "completed" && "border-emerald-500 text-emerald-500",
        status === "pending" && "border-amber-500 text-amber-500",
        status === "refunded" && "border-rose-500 text-rose-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
