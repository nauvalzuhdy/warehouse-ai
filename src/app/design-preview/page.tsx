/**
 * DESIGN SYSTEM PREVIEW PAGE
 * 
 * Development-only page for showcasing design tokens, components, and styles.
 * Remove this file before deploying to production.
 */

import { Package, TrendingUp, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { typography } from "@/lib/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DesignPreviewPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Design System Preview"
        description="Development-only page for testing design tokens and components"
      />

      {/* COLORS SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Colors</h2>
        <p className={`mb-6 ${typography.body.sm}`}>
          Custom color tokens for the design system
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Primary Blue */}
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-primary"></div>
            <p className={typography.label.sm}>Primary Blue</p>
            <p className={`text-xs ${typography.body.muted}`}>--primary</p>
          </div>

          {/* Priority Critical */}
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-priority-critical"></div>
            <p className={typography.label.sm}>Critical</p>
            <p className={`text-xs ${typography.body.muted}`}>
              --priority-critical
            </p>
          </div>

          {/* Priority High */}
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-priority-high"></div>
            <p className={typography.label.sm}>High</p>
            <p className={`text-xs ${typography.body.muted}`}>
              --priority-high
            </p>
          </div>

          {/* Priority Medium */}
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-priority-medium"></div>
            <p className={typography.label.sm}>Medium</p>
            <p className={`text-xs ${typography.body.muted}`}>
              --priority-medium
            </p>
          </div>

          {/* Priority Low */}
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-priority-low"></div>
            <p className={typography.label.sm}>Low</p>
            <p className={`text-xs ${typography.body.muted}`}>
              --priority-low
            </p>
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Typography</h2>
        <p className={`mb-6 ${typography.body.sm}`}>Typography variants</p>

        <div className="space-y-8">
          {/* Headings */}
          <div>
            <p className={`mb-4 ${typography.label.default}`}>Headings</p>
            <div className="space-y-3">
              <p className={typography.heading.h1}>H1 — Large Bold Heading</p>
              <p className={typography.heading.h2}>
                H2 — Medium Bold Heading
              </p>
              <p className={typography.heading.h3}>
                H3 — Small Semibold Heading
              </p>
            </div>
          </div>

          {/* Body */}
          <div>
            <p className={`mb-4 ${typography.label.default}`}>Body Text</p>
            <div className="space-y-3">
              <p className={typography.body.default}>
                Default — Normal body text
              </p>
              <p className={typography.body.sm}>
                SM — Small body text for secondary content
              </p>
              <p className={typography.body.muted}>
                Muted — Tertiary text for hints and timestamps
              </p>
            </div>
          </div>

          {/* Labels */}
          <div>
            <p className={`mb-4 ${typography.label.default}`}>Labels</p>
            <div className="space-y-3">
              <label className={typography.label.default}>
                Default label
              </label>
              <label className={typography.label.sm}>Small label</label>
            </div>
          </div>
        </div>
      </section>

      {/* BUTTONS SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Buttons</h2>
        <p className={`mb-6 ${typography.body.sm}`}>
          Shadcn Button variants and sizes
        </p>

        <div className="space-y-6">
          {/* Variants */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>Variants</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>Sizes</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button>Default Size</Button>
              <Button size="sm">Small Size</Button>
            </div>
          </div>
        </div>
      </section>

      {/* STAT CARDS SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Stat Cards</h2>
        <p className={`mb-6 ${typography.body.sm}`}>
          Dashboard stat cards with trends
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Produk"
            value="248"
            description="di 3 gudang"
            icon={<Package className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />

          <StatCard
            title="Stok Rendah"
            value="23"
            description="perlu reorder"
            icon={<AlertCircle className="h-5 w-5" />}
            trend={{ value: 5, isPositive: false }}
          />

          <StatCard
            title="Gudang Aktif"
            value="3"
            description="semua lokasi"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* PRIORITY BADGES SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Priority Badges</h2>
        <p className={`mb-6 ${typography.body.sm}`}>
          AI insight priority level indicators
        </p>

        <div className="flex flex-wrap gap-3">
          <PriorityBadge priority="critical" />
          <PriorityBadge priority="high" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="low" />
        </div>
      </section>

      {/* SHADCN COMPONENTS SECTION */}
      <section className="mb-12">
        <h2 className={typography.heading.h2}>Shadcn UI Components</h2>
        <p className={`mb-6 ${typography.body.sm}`}>
          Common UI components from shadcn/ui
        </p>

        <div className="space-y-8">
          {/* Badge Variants */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>Badges</p>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Input */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>Input</p>
            <Input placeholder="Enter text..." className="w-full max-w-sm" />
          </div>

          {/* Label + Input */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>
              Label + Input
            </p>
            <div className="space-y-2">
              <Label htmlFor="warehouse">Pilih Gudang</Label>
              <Input id="warehouse" placeholder="Nama gudang..." />
            </div>
          </div>

          {/* Select */}
          <div>
            <p className={`mb-3 ${typography.label.default}`}>Select</p>
            <Select>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Pilih opsi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Opsi 1</SelectItem>
                <SelectItem value="option2">Opsi 2</SelectItem>
                <SelectItem value="option3">Opsi 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className={`${typography.body.sm} text-yellow-900`}>
          ⚠️ <strong>Development Only:</strong> This page is for design system
          preview purposes. Remove the entire{" "}
          <code className="rounded bg-yellow-100 px-1">
            /design-preview
          </code>{" "}
          route before production deployment.
        </p>
      </div>
    </PageContainer>
  );
}
