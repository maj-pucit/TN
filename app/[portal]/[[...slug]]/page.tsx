import { notFound } from "next/navigation";
import { allRoutes, resolve, PORTALS, type PortalKey } from "@/lib/portals";
import { ModulePage } from "@/components/ModulePage";
import { Gallery } from "@/components/Gallery";
import { CandidateDashboard } from "@/components/candidate/Dashboard";
import { ProfilePage } from "@/components/candidate/Profile";
import { PaymentsPage } from "@/components/candidate/Payments";
import { ProgressPage } from "@/components/candidate/Progress";
import { CourseworkPage } from "@/components/candidate/Coursework";
import { LevelPage, ResultPage, CoursesPage, CoursePage, CoursePayPage } from "@/components/candidate/Level";
import { InterviewsHome, AgentsPage, BookPage, CheckoutPage, ReportPage } from "@/components/candidate/Interviews";
import { AgentDashboard } from "@/components/agent/Dashboard";
import { AgentEarnings, AgentStanding } from "@/components/agent/Earnings";
import { AgentProfile } from "@/components/agent/Profile";
import { AdminDashboard } from "@/components/admin/Dashboard";
import { AdminUsers } from "@/components/admin/Users";
import { PersonDetail, AgentInterviewDetail } from "@/components/admin/People";
import { AdminRoles, AdminImport } from "@/components/admin/Roles";
import { AdminInterviews, AdminBooking, AdminRecordings, AdminRecording } from "@/components/admin/Interviews";
import { AdminCatalogue, AdminCourse } from "@/components/admin/Catalogue";
import { AdminTransactions, AdminTransaction, AdminPayouts, AdminFeeSettings, AdminDiscounts, AdminDiscount, AdminReconciliation, AdminBatch } from "@/components/admin/Finance";
import { AdminOnboarding, AdminIntegrations, AdminSettings, AdminProfile, AdminGeneral } from "@/components/admin/System";
import { AdminLevellingLog, AdminLevelChange, AdminApprovals, AdminApproval } from "@/components/admin/Levelling";
import { AgentInterviews, AgentInterview, AgentTranscript } from "@/components/agent/Interviews";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ portal: r.portal, slug: r.slug }));
}

export default async function Route({ params }: { params: Promise<{ portal: string; slug?: string[] }> }) {
  const { portal, slug = [] } = await params;
  if (!(portal in PORTALS)) notFound();
  const p = portal as PortalKey;
  const { title } = resolve(p, slug);
  if (slug[0] === "gallery") return <Gallery />;
  if (p === "candidate" && slug.length === 0) return <CandidateDashboard />;
  if (p === "candidate" && slug[0] === "profile") return <ProfilePage />;
  if (p === "candidate" && slug[0] === "payments") return <PaymentsPage />;
  if (p === "candidate" && slug[0] === "progress") return <ProgressPage />;
  if (p === "candidate" && slug[0] === "coursework") return <CourseworkPage />;
  if (p === "candidate" && slug[0] === "level") return slug[1] === "result" ? <ResultPage /> : <LevelPage />;
  if (p === "candidate" && slug[0] === "enrollment") {
    if (slug[1] === "course") return <CoursePage k={slug[2]} />;
    if (slug[1] === "pay") return <CoursePayPage k={slug[2]} />;
    return <CoursesPage />;
  }
  if (p === "candidate" && slug[0] === "interviews") {
    const [, sub, arg] = slug;
    if (sub === "agents") return <AgentsPage />;
    if (sub === "book") return <BookPage agent={arg} />;
    if (sub === "checkout") return <CheckoutPage agent={arg} />;
    if (sub === "report") return <ReportPage kind={arg === "re" ? "re" : "level"} />;
    return <InterviewsHome />;
  }
  if (p === "agent" && slug.length === 0) return <AgentDashboard />;
  if (p === "agent" && slug[0] === "earnings") return <AgentEarnings />;
  if (p === "agent" && slug[0] === "standing") return <AgentStanding />;
  if (p === "agent" && slug[0] === "profile") return <AgentProfile />;
  if (p === "agent" && slug[0] === "interviews") {
    if (slug[2] === "transcript") return <AgentTranscript id={slug[1]} />;
    if (slug[1]) return <AgentInterview id={slug[1]} />;
    return <AgentInterviews />;
  }
  if (p === "admin" && slug.length === 0) return <AdminDashboard />;
  if (p === "admin" && slug[0] === "users" && slug[1] === "roles") return <AdminRoles />;
  if (p === "admin" && slug[0] === "catalogue") return slug[1] ? <AdminCourse id={slug[1]} /> : <AdminCatalogue />;
  if (p === "admin" && slug[0] === "onboarding") return <AdminOnboarding />;
  if (p === "admin" && slug[0] === "integrations") return <AdminIntegrations />;
  if (p === "admin" && slug[0] === "settings") return <AdminSettings tab={slug[1]} />;
  if (p === "admin" && slug[0] === "my-profile") return <AdminProfile />;
  if (p === "admin" && slug[0] === "general") return <AdminGeneral />;
  if (p === "admin" && slug[0] === "finance") {
    const id = slug[2];
    if (slug[1] === "transactions") return id ? <AdminTransaction id={id} /> : <AdminTransactions />;
    if (slug[1] === "payouts") return <AdminPayouts />;
    if (slug[1] === "fees") return <AdminFeeSettings />;
    if (slug[1] === "discounts") return id ? <AdminDiscount id={id} /> : <AdminDiscounts />;
    if (slug[1] === "reconciliation") return id ? <AdminBatch id={id} /> : <AdminReconciliation />;
    return <AdminTransactions />;
  }
  if (p === "admin" && slug[0] === "interviews") {
    if (slug[1] === "recordings") return slug[2] ? <AdminRecording id={slug[2]} /> : <AdminRecordings />;
    return slug[2] ? <AdminBooking id={slug[2]} /> : <AdminInterviews />;
  }
  if (p === "admin" && slug[0] === "levelling") {
    if (slug[1] === "approvals") return slug[2] ? <AdminApproval id={slug[2]} /> : <AdminApprovals />;
    return slug[2] ? <AdminLevelChange id={slug[2]} /> : <AdminLevellingLog />;
  }
  if (p === "admin" && slug[0] === "users" && slug[1] === "import") return <AdminImport />;
  if (p === "admin" && slug[0] === "users" && !slug[1]) return <AdminUsers />;
  if (p === "admin" && slug[0] === "users" && slug[1] === "all") {
    if (slug[3]) return <AgentInterviewDetail agentId={slug[2]} id={slug[3]} />;
    if (slug[2]) return <PersonDetail id={slug[2]} />;
    return <AdminUsers />;
  }
  return <ModulePage portal={p} slug={slug} title={title} first={PORTALS[p].person.first} />;
}
