"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";
import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn(
      "group not-prose mb-2 w-full max-w-full rounded-lg border bg-card/50",
      className,
    )}
    {...props}
  />
);

type ToolState = ToolUIPart["state"];

const STATE_CONFIG: Record<
  ToolState,
  {
    label: string;
    icon: ReactNode;
    badgeVariant: "outline" | "secondary" | "default" | "destructive";
  }
> = {
  "input-streaming": {
    label: "Preparing…",
    icon: <Loader2Icon className="size-3 animate-spin" />,
    badgeVariant: "outline",
  },
  "input-available": {
    label: "Running…",
    icon: <Loader2Icon className="size-3 animate-spin" />,
    badgeVariant: "secondary",
  },
  "approval-requested": {
    label: "Awaiting approval",
    icon: <WrenchIcon className="size-3" />,
    badgeVariant: "outline",
  },
  "approval-responded": {
    label: "Approved",
    icon: <CheckIcon className="size-3" />,
    badgeVariant: "secondary",
  },
  "output-available": {
    label: "Done",
    icon: <CheckIcon className="size-3" />,
    badgeVariant: "default",
  },
  "output-error": {
    label: "Failed",
    icon: <XIcon className="size-3" />,
    badgeVariant: "destructive",
  },
  "output-denied": {
    label: "Denied",
    icon: <XIcon className="size-3" />,
    badgeVariant: "outline",
  },
};

export type ToolHeaderProps = {
  /** The tool part's `type`, e.g. `"tool-getWeather"` or `"dynamic-tool"`. */
  type: `tool-${string}` | "dynamic-tool";
  state: ToolState;
  /** Optional override for the display name (defaults to `type` with the `tool-` prefix stripped). */
  title?: string;
  className?: string;
};

export const ToolHeader = ({
  type,
  state,
  title,
  className,
}: ToolHeaderProps) => {
  const config = STATE_CONFIG[state];
  const name = title ?? type.replace(/^tool-/, "");

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm",
        className,
      )}
    >
      <span className="flex items-center gap-2 font-medium text-muted-foreground">
        <WrenchIcon className="size-3.5" />
        <span className="text-foreground">{name}</span>
      </span>
      <span className="flex items-center gap-2">
        <Badge className="gap-1" variant={config.badgeVariant}>
          {config.icon}
          {config.label}
        </Badge>
        <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
      </span>
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "space-y-3 overflow-hidden border-t px-3 py-3 text-xs",
      className,
    )}
    {...props}
  />
);

const CodeBlock = ({ value }: { value: unknown }) => (
  <pre className="max-h-64 overflow-auto rounded-md bg-muted p-2 font-mono text-[11px] leading-relaxed">
    {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
  </pre>
);

export type ToolInputProps = {
  input: unknown;
};

export const ToolInput = ({ input }: ToolInputProps) => (
  <div>
    <p className="mb-1 font-medium text-muted-foreground">Input</p>
    <CodeBlock value={input} />
  </div>
);

export type ToolOutputProps = {
  output?: unknown;
  errorText?: string;
};

export const ToolOutput = ({ output, errorText }: ToolOutputProps) => {
  if (errorText) {
    return (
      <div>
        <p className="mb-1 font-medium text-destructive">Error</p>
        <CodeBlock value={errorText} />
      </div>
    );
  }

  if (output === undefined) return null;

  return (
    <div>
      <p className="mb-1 font-medium text-muted-foreground">Output</p>
      <CodeBlock value={output} />
    </div>
  );
};
