// Dashboard page with quick actions and statistics
import { Users, Stethoscope, TestTube, CreditCard, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const weeklyAppointmentsData = [
  { day: "M", appointments: 45 },
  { day: "T", appointments: 52 },
  { day: "W", appointments: 38 },
  { day: "Th", appointments: 65 },
  { day: "F", appointments: 55 },
  { day: "ST", appointments: 30 },
  { day: "S", appointments: 25 },
];

const newPatientsData = [
  { day: "M", patients: 12 },
  { day: "T", patients: 15 },
  { day: "W", patients: 10 },
  { day: "Th", patients: 18 },
  { day: "F", patients: 14 },
  { day: "ST", patients: 8 },
  { day: "S", patients: 6 },
];

const testData = [
  { day: "M", tests: 28 },
  { day: "T", tests: 32 },
  { day: "W", tests: 25 },
  { day: "Th", tests: 35 },
  { day: "F", tests: 30 },
  { day: "ST", tests: 18 },
  { day: "S", tests: 15 },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => window.location.href = '/prescriptions'}
            className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-white text-xl font-semibold mb-2 relative z-10">Add Prescription</h3>
            <p className="text-green-100 text-sm mb-4 relative z-10">Create new patient prescription</p>
            <div className="flex justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div 
            onClick={() => window.location.href = '/billing'}
            className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in relative overflow-hidden"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-white text-xl font-semibold mb-2 relative z-10">Manage Billing</h3>
            <p className="text-blue-100 text-sm mb-4 relative z-10">View and track invoices</p>
            <div className="flex justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div 
            onClick={() => window.location.href = '/patients'}
            className="group bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in relative overflow-hidden"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-white text-xl font-semibold mb-2 relative z-10">Manage Patients</h3>
            <p className="text-yellow-100 text-sm mb-4 relative z-10">Add and manage patient information</p>
            <div className="flex justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
              <Users className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-900 font-semibold mb-2">Today's Appointments / Follow-Ups (0)</h3>
          <p className="text-red-600">No appointments available</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Doctors"
            value="0"
            icon={Stethoscope}
            variant="primary"
          />
          <StatCard
            title="Total Employees"
            value="0"
            icon={Users}
            variant="secondary"
          />
          <StatCard
            title="Type of tests"
            value="0"
            icon={TestTube}
            variant="primary"
          />
          <StatCard
            title="Patients with Cards"
            value="0"
            icon={CreditCard}
            variant="secondary"
          />
        </div>

        {/* Collection and Tests Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Today's Collection">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">₹25,000/-</div>
              <div className="text-sm text-secondary font-medium">
                Up 10% ↑
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Today's Tests">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">% -</div>
            </div>
          </ChartCard>

          <ChartCard title="Today's Radiology">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">% -</div>
            </div>
          </ChartCard>

          <ChartCard title="Today's Pathology">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">% -</div>
            </div>
          </ChartCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Weekly Appointments" onViewDetails={() => {}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyAppointmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="New Patients" onViewDetails={() => {}}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={newPatientsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Test Data" onViewDetails={() => {}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="tests" fill="hsl(var(--chart-green))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Doctor's Efficiency">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DOCTOR</TableHead>
                  <TableHead>NUMBER OF PATIENTS</TableHead>
                  <TableHead>PRESCRIBED TESTS</TableHead>
                  <TableHead>REVENUE GENERATED</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ChartCard>

          <ChartCard title="Monthly Income Summary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TYPE</TableHead>
                  <TableHead>TOTAL INCOME</TableHead>
                  <TableHead>CASH</TableHead>
                  <TableHead>ONLINE</TableHead>
                  <TableHead>REFUND</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
