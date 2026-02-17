import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

interface VerificationBadgeProps {
  status: "pending" | "approved" | "rejected"
  className?: string
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = {
    pending: {
      label: "Pending Approval",
      icon: Clock,
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    approved: {
      label: "Verified",
      icon: CheckCircle2,
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-300",
    },
    rejected: {
      label: "Verification Failed",
      icon: XCircle,
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 border-red-300",
    },
  }

  const { label, icon: Icon, className: badgeClass } = config[status]

  return (
    <Badge className={`${badgeClass} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  )
}
