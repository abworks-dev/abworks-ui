"use client";

// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/command.tsx
// Local adaptations: package-relative imports and lucide-react icons.

import * as React from "react";
import { cn } from "../lib/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { InputGroup, InputGroupAddon } from "./input-group";
import { SearchIcon } from "lucide-react";

type CommandEntry = {
  element: HTMLButtonElement;
  value: string;
  id: string;
  disabled?: boolean;
};
export type CommandInputValueChangeDetails = {
  reason: "input-change";
  event: Event;
  trigger: HTMLInputElement;
};

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
  onInputValueChange?: (
    value: string,
    details: CommandInputValueChangeDetails,
  ) => void;
  onSelect?: () => void;
  shouldFilter: boolean;
  listId: string;
  activeId?: string;
  setActiveId: (id?: string) => void;
  focusedId?: string;
  setFocusedId: (id?: string) => void;
  entries: CommandEntry[];
  register: (entry: CommandEntry) => void;
  unregister: (element: HTMLButtonElement) => void;
  ready: boolean;
};
const CommandContext = React.createContext<CommandContextValue | null>(null);
const normalizeText = (value: string) => value.trim().toLowerCase();
const extractText = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((child) => {
      if (
        typeof child === "string" ||
        typeof child === "number" ||
        typeof child === "bigint"
      )
        return String(child);
      if (React.isValidElement(child))
        return extractText(
          (child.props as { children?: React.ReactNode }).children,
        );
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

export type CommandProps = React.ComponentProps<"div"> & {
  shouldFilter?: boolean;
  onInputValueChange?: (
    value: string,
    details: CommandInputValueChangeDetails,
  ) => void;
  onSelect?: () => void;
};
function Command({
  className,
  shouldFilter = true,
  onInputValueChange,
  onSelect,
  onKeyDown,
  ...props
}: CommandProps) {
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState<string>();
  const [focusedId, setFocusedId] = React.useState<string>();
  const [entries, setEntries] = React.useState<CommandEntry[]>([]);
  const [ready, setReady] = React.useState(false);
  const listId = `command-list-${React.useId().replace(/:/g, "")}`;
  const register = React.useCallback(
    (entry: CommandEntry) =>
      setEntries((current) =>
        current.some((item) => item.element === entry.element)
          ? current.map((item) =>
              item.element === entry.element ? entry : item,
            )
          : [...current, entry],
      ),
    [],
  );
  const unregister = React.useCallback(
    (element: HTMLButtonElement) =>
      setEntries((current) =>
        current.filter((item) => item.element !== element),
      ),
    [],
  );
  React.useEffect(() => {
    setReady(true);
  }, []);
  const context = React.useMemo(
    () => ({
      search,
      setSearch,
      onInputValueChange,
      onSelect,
      shouldFilter,
      listId,
      activeId,
      setActiveId,
      focusedId,
      setFocusedId,
      entries,
      register,
      unregister,
      ready,
    }),
    [
      activeId,
      entries,
      focusedId,
      listId,
      onInputValueChange,
      onSelect,
      ready,
      register,
      search,
      shouldFilter,
      unregister,
    ],
  );
  const visible = React.useMemo(
    () =>
      entries.filter(
        (entry) =>
          !entry.disabled &&
          (!shouldFilter ||
            !search ||
            normalizeText(entry.value).includes(normalizeText(search))),
      ),
    [entries, search, shouldFilter],
  );
  React.useEffect(() => {
    if (activeId && !visible.some((entry) => entry.id === activeId))
      setActiveId(visible[0]?.id);
  }, [activeId, visible]);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (visible.length) {
        const current = visible.findIndex(
          (entry) =>
            entry.id === activeId || entry.element === document.activeElement,
        );
        const nextIndex =
          current < 0 && event.key === "ArrowUp"
            ? visible.length - 1
            : (current +
                (event.key === "ArrowDown" ? 1 : -1) +
                visible.length) %
              visible.length;
        const next = visible[nextIndex];
        setActiveId(next.id);
        next.element.focus();
      }
    } else if (event.key === "Enter" && activeId) {
      const active = visible.find((entry) => entry.id === activeId);
      if (active) {
        event.preventDefault();
        active.element.click();
      }
    }
    onKeyDown?.(event);
  };
  return (
    <CommandContext.Provider value={context}>
      <div
        role="application"
        aria-label="Command menu"
        data-slot="command"
        className={cn(
          "cn-command flex size-full flex-col overflow-hidden",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </CommandContext.Provider>
  );
}

export type CommandDialogProps = Omit<
  React.ComponentProps<typeof Dialog>,
  "children" | "defaultOpen" | "onOpenChange" | "open"
> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  ...props
}: CommandDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "cn-command-dialog fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden rounded-lg border bg-background p-0 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        <Command
          onSelect={() => setOpen(false)}
          className="**:data-[slot=command-input-wrapper]:h-12 **:[[data-slot=command-group]]:px-2 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5 **:[[data-slot=command-item]]:px-2 **:[[data-slot=command-item]]:py-3"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export type CommandInputProps = React.ComponentProps<"input"> & {
  onValueChange?: (value: string) => void;
  onInputValueChange?: (
    value: string,
    details: CommandInputValueChangeDetails,
  ) => void;
};
function CommandInput({
  className,
  onChange,
  onValueChange,
  onInputValueChange,
  value,
  id: _callerId,
  "aria-controls": _callerAriaControls,
  "aria-activedescendant": _callerAriaActivedescendant,
  ...props
}: CommandInputProps) {
  const context = React.useContext(CommandContext);
  const setSearch = context?.setSearch;
  React.useLayoutEffect(() => {
    if (value !== undefined) setSearch?.(String(value));
  }, [setSearch, value]);
  return (
    <div data-slot="command-input-wrapper" className="cn-command-input-wrapper">
      <InputGroup className="cn-command-input-group">
        <input
          data-slot="command-input"
          id={`${context?.listId}-input`}
          role="combobox"
          aria-autocomplete="list"
          className={cn(
            "cn-command-input h-9 min-w-0 w-0 flex-1 bg-transparent px-3 outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          value={value}
          onChange={(event) => {
            const details: CommandInputValueChangeDetails = {
              reason: "input-change",
              event: event.nativeEvent,
              trigger: event.currentTarget,
            };
            setSearch?.(event.currentTarget.value);
            onChange?.(event);
            onValueChange?.(event.currentTarget.value);
            onInputValueChange?.(event.currentTarget.value, details);
            context?.onInputValueChange?.(event.currentTarget.value, details);
          }}
          {...props}
          aria-controls={context?.listId}
          aria-activedescendant={context?.activeId}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="cn-command-input-icon" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
function CommandList({
  className,
  id: _callerId,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(CommandContext);
  return (
    <div
      {...props}
      id={context?.listId}
      role="listbox"
      data-slot="command-list"
      className={cn(
        "cn-command-list overflow-x-hidden overflow-y-auto",
        className,
      )}
    />
  );
}
function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(CommandContext);
  const visible =
    context?.entries.some(
      (entry) =>
        !entry.disabled &&
        (!context.shouldFilter ||
          !context.search ||
          normalizeText(entry.value).includes(normalizeText(context.search))),
    ) ?? false;
  return !context?.ready || visible ? null : (
    <div
      role="status"
      data-slot="command-empty"
      className={cn("cn-command-empty", className)}
      {...props}
    />
  );
}
export type CommandGroupProps = React.ComponentProps<"div"> & {
  heading?: React.ReactNode;
};
function CommandGroup({
  className,
  heading,
  children,
  ...props
}: CommandGroupProps) {
  return (
    <div
      role="group"
      aria-label={typeof heading === "string" ? heading : undefined}
      data-slot="command-group"
      className={cn("cn-command-group", className)}
      {...props}
    >
      {heading !== undefined ? (
        <div data-slot="command-group-heading">{heading}</div>
      ) : null}
      {children}
    </div>
  );
}
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="command-separator"
      className={cn("cn-command-separator", className)}
      {...props}
    />
  );
}
export type CommandItemProps = Omit<
  React.ComponentProps<"button">,
  "onSelect"
> & {
  value?: string;
  onSelect?: (value: string) => void;
  "aria-selected"?: React.AriaAttributes["aria-selected"];
  "data-selected"?: string;
  "data-focused"?: string;
};
function CommandItem({
  className,
  children,
  value,
  onSelect,
  id: _callerId,
  "aria-selected": _callerAriaSelected,
  "data-selected": _callerDataSelected,
  "data-focused": _callerDataFocused,
  onClick,
  onFocus,
  onBlur,
  type = "button",
  // Callers that embed a Command list inside a menu surface need the menu item
  // roles; a passed role must win over the list-box default.
  role = "option",
  disabled,
  ...props
}: CommandItemProps) {
  const context = React.useContext(CommandContext);
  const ref = React.useRef<HTMLButtonElement>(null);
  const id = `command-item-${React.useId().replace(/:/g, "")}`;
  const itemValue = value ?? extractText(children);
  const register = context?.register;
  const unregister = context?.unregister;
  React.useEffect(() => {
    const element = ref.current;
    if (!element || !register || !unregister) return;
    register({ element, value: itemValue, id, disabled });
    return () => unregister(element);
  }, [disabled, id, itemValue, register, unregister]);
  const hidden = Boolean(
    context?.shouldFilter &&
    context.search &&
    !normalizeText(itemValue).includes(normalizeText(context.search)),
  );
  const selected = context?.activeId === id;
  const focused = context?.focusedId === id;
  return (
    <button
      {...props}
      ref={ref}
      id={id}
      type={type}
      role={role}
      aria-hidden={hidden || undefined}
      aria-selected={selected}
      data-selected={selected ? "true" : undefined}
      data-focused={focused ? "true" : undefined}
      data-slot="command-item"
      data-value={itemValue}
      data-hidden={hidden ? "true" : undefined}
      disabled={disabled}
      tabIndex={hidden ? -1 : props.tabIndex}
      style={{
        ...props.style,
        ...(hidden
          ? { opacity: 0, position: "absolute", pointerEvents: "none" }
          : {}),
      }}
      className={cn(
        "cn-command-item group/command-item disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground data-focused:bg-accent data-focused:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 w-full justify-start",
        className,
      )}
      onFocus={(event) => {
        onFocus?.(event);
        context?.setFocusedId(id);
        if (!disabled) context?.setActiveId(id);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        context?.setFocusedId(undefined);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          onSelect?.(itemValue);
          context?.onSelect?.();
        }
      }}
    >
      {children}
    </button>
  );
}
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("cn-command-shortcut", className)}
      {...props}
    />
  );
}
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
