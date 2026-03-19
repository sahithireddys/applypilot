"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  LayoutDashboard,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Status = "Applied" | "Interviewing" | "Offer" | "Rejected";
type Priority = "High" | "Medium" | "Low";

type Application = {
  id: number;
  company: string;
  role: string;
  location: string;
  dateApplied: string;
  status: Status;
  priority: Priority;
  source: string;
  notes: string;
  nextStep: string;
};

const seedApplications: Application[] = [
  {
    id: 1,
    company: "OpenAI",
    role: "Frontend Engineer",
    location: "San Francisco, CA",
    dateApplied: "2026-03-08",
    status: "Interviewing",
    priority: "High",
    source: "LinkedIn",
    notes: "Recruiter screen completed. Need to prepare component architecture examples.",
    nextStep: "Technical interview on Mar 19",
  },
  {
    id: 2,
    company: "Notion",
    role: "Software Engineer, Web",
    location: "Remote",
    dateApplied: "2026-03-05",
    status: "Applied",
    priority: "Medium",
    source: "Company Careers",
    notes: "Strong fit for product-minded frontend work.",
    nextStep: "Follow up in 1 week",
  },
  {
    id: 3,
    company: "Figma",
    role: "Frontend Developer",
    location: "New York, NY",
    dateApplied: "2026-03-02",
    status: "Rejected",
    priority: "Low",
    source: "Referral",
    notes: "Role required deeper design systems experience.",
    nextStep: "Review feedback and improve case studies",
  },
  {
    id: 4,
    company: "Stripe",
    role: "UI Engineer",
    location: "Seattle, WA",
    dateApplied: "2026-03-10",
    status: "Offer",
    priority: "High",
    source: "LinkedIn",
    notes: "Offer stage reached after final round.",
    nextStep: "Decision due Mar 21",
  },
  {
    id: 5,
    company: "Vercel",
    role: "Frontend Engineer",
    location: "Remote",
    dateApplied: "2026-03-12",
    status: "Applied",
    priority: "High",
    source: "Company Careers",
    notes: "Great match with Next.js experience and developer tooling interest.",
    nextStep: "Portfolio follow-up",
  },
  {
    id: 6,
    company: "Airbnb",
    role: "Product Engineer",
    location: "Remote",
    dateApplied: "2026-03-01",
    status: "Interviewing",
    priority: "Medium",
    source: "Referral",
    notes: "Need to review accessibility and performance optimization examples.",
    nextStep: "Panel interview on Mar 20",
  },
];

const statusOrder: Status[] = ["Applied", "Interviewing", "Offer", "Rejected"];

const statusStyles: Record<Status, string> = {
  Applied: "bg-slate-100 text-slate-700 border-slate-200",
  Interviewing: "bg-blue-50 text-blue-700 border-blue-200",
  Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Medium: "bg-violet-50 text-violet-700 border-violet-200",
  Low: "bg-slate-100 text-slate-700 border-slate-200",
};

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Applications", icon: Briefcase },
] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysAgo(date: string) {
  const today = new Date("2026-03-16");
  const then = new Date(date);
  const diff = Math.max(
    0,
    Math.floor((today.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
  );
  return `${diff}d ago`;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {value}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge className={`rounded-full border px-3 py-1 font-medium ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge className={`rounded-full border px-3 py-1 font-medium ${priorityStyles[priority]}`}>
      {priority}
    </Badge>
  );
}

export default function ApplyPilotApp() {
  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<number>(seedApplications[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState<"Dashboard" | "Applications">("Dashboard");

  const [formData, setFormData] = useState<Omit<Application, "id">>({
    company: "",
    role: "",
    location: "",
    dateApplied: "2026-03-16",
    status: "Applied",
    priority: "Medium",
    source: "LinkedIn",
    notes: "",
    nextStep: "",
  });

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const matchesSearch =
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.role.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const selectedApplication =
    filteredApplications.find((app) => app.id === selectedId) ||
    applications.find((app) => app.id === selectedId) ||
    applications[0];

  const stats = useMemo(() => {
    const total = applications.length;
    const interviewing = applications.filter((a) => a.status === "Interviewing").length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    return { total, interviewing, offers };
  }, [applications]);

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      location: "",
      dateApplied: "2026-03-16",
      status: "Applied",
      priority: "Medium",
      source: "LinkedIn",
      notes: "",
      nextStep: "",
    });
    setEditingId(null);
  };

  const handleSaveApplication = () => {
    if (!formData.company || !formData.role || !formData.location) return;

    if (editingId !== null) {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...formData, id: editingId } : item
        )
      );
      setSelectedId(editingId);
    } else {
      const newApplication: Application = {
        id: Date.now(),
        ...formData,
      };
      setApplications((prev) => [newApplication, ...prev]);
      setSelectedId(newApplication.id);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEditApplication = () => {
    if (!selectedApplication) return;

    const { id, ...rest } = selectedApplication;
    setEditingId(id);
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleDeleteApplication = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.filter(
      (item) => item.id !== selectedApplication.id
    );

    setApplications(updatedApplications);

    if (updatedApplications.length > 0) {
      setSelectedId(updatedApplications[0].id);
    } else {
      setSelectedId(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">ApplyPilot</h1>
                <p className="text-sm text-slate-500">Application tracking dashboard</p>
              </div>
            </div>

            <nav className="space-y-2 px-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => setActivePage(item.label)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="m-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-sm">
            <div className="m-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-sm">
  <p className="text-sm text-slate-300">Active pipeline</p>
  <h3 className="mt-2 text-xl font-semibold">
    {stats.interviewing} {stats.interviewing === 1 ? "role in interview stage" : "roles in interview stage"}
  </h3>
  <p className="mt-2 text-sm text-slate-300">
    Keep follow-ups updated and prepare for upcoming conversations.
  </p>
</div>
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
                  <Target className="h-4 w-4" />
                  Application tracking made simple
                </div>

                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  A smarter way to manage your job search from application to offer.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  ApplyPilot helps job seekers organize applications, track interview
                  progress, manage follow-ups, and keep important notes in one streamlined
                  workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Sign Out
                  </Button>
                </Link>

                <Button
                  className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => {
                    setActivePage("Applications");
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Application
                </Button>
              </div>
            </div>
          </motion.section>

          {activePage === "Dashboard" && (
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total Applications"
                value={String(stats.total)}
                subtitle="Across tracked roles"
                icon={Briefcase}
              />
              <StatCard
                title="Interviewing"
                value={String(stats.interviewing)}
                subtitle="Active conversations"
                icon={Clock3}
              />
              <StatCard
                title="Offers"
                value={String(stats.offers)}
                subtitle="Offers received"
                icon={CheckCircle2}
              />
            </section>
          )}

          {activePage === "Dashboard" && (
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applications.slice(0, 3).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{application.company}</p>
                        <p className="text-sm text-slate-500">{application.role}</p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Next interview</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      Technical interview on Mar 19
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Priority focus</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      Follow up on roles that have been in Applied status for more than a week.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {activePage === "Applications" && (
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-xl">Applications</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Search, filter, and review your current pipeline.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search company, role, location"
                          className="rounded-2xl border-slate-200 pl-10"
                        />
                      </div>

                      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[170px] border-0 px-0 shadow-none focus:ring-0">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All statuses</SelectItem>
                            {statusOrder.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {filteredApplications.map((application) => (
                      <button
                        key={application.id}
                        onClick={() => setSelectedId(application.id)}
                        className={`grid w-full gap-4 rounded-3xl border p-4 text-left transition hover:border-slate-300 hover:bg-slate-50 md:grid-cols-[1.1fr_0.9fr_0.7fr_0.5fr_0.5fr_auto] ${
                          selectedApplication?.id === application.id
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-500" />
                            <p className="font-semibold text-slate-900">{application.company}</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{application.role}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4" />
                          {application.location}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(application.dateApplied)}
                        </div>

                        <div>
                          <StatusBadge status={application.status} />
                        </div>

                        <div>
                          <PriorityBadge priority={application.priority} />
                        </div>

                        <div className="flex items-center justify-end text-slate-400">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Application Details</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {selectedApplication ? (
                      <div className="space-y-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-500">Selected application</p>
                            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                              {selectedApplication.role}
                            </h3>
                            <p className="mt-1 text-slate-600">{selectedApplication.company}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="rounded-2xl"
                              onClick={handleEditApplication}
                            >
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={handleDeleteApplication}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <StatusBadge status={selectedApplication.status} />
                          <PriorityBadge priority={selectedApplication.priority} />
                          <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700">
                            {selectedApplication.source}
                          </Badge>
                        </div>

                        <div className="grid gap-4 rounded-3xl bg-slate-50 p-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Applied
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {formatDate(selectedApplication.dateApplied)} ·{" "}
                              {daysAgo(selectedApplication.dateApplied)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Next Step
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {selectedApplication.nextStep}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Notes
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                              {selectedApplication.notes}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">Timeline</p>
                          <div className="mt-3 space-y-3">
                            <div className="flex gap-3">
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  Application submitted
                                </p>
                                <p className="text-sm text-slate-500">
                                  Materials tailored and submitted through{" "}
                                  {selectedApplication.source}.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  Next milestone
                                </p>
                                <p className="text-sm text-slate-500">
                                  {selectedApplication.nextStep}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Select an application to view details.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl border-0 p-0 shadow-xl">
          <DialogHeader className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {editingId !== null ? "Edit Application" : "Add New Application"}
                </DialogTitle>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId !== null
                    ? "Update role details, status, notes, and next steps."
                    : "Track a new role with details, status, and next steps."}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Meta"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Frontend Developer"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Remote / City, State"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date Applied</label>
              <Input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Status })
                }
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOrder.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value as Priority })
                }
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Source</label>
              <Input
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="LinkedIn / Referral / Careers page"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add context, interview prep notes, recruiter details..."
                className="min-h-[110px] rounded-2xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Next Step</label>
              <Input
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                placeholder="Follow up on Mar 20 / recruiter screen scheduled"
                className="rounded-2xl"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 px-6 py-5">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                className="rounded-2xl bg-slate-900 hover:bg-slate-800"
                onClick={handleSaveApplication}
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingId !== null ? "Update Application" : "Save Application"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}