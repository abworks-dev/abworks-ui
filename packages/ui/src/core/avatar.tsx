"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "../lib/cn";

type AvatarImageStatus = "loading" | "loaded" | "error";
type AvatarRootStatus = AvatarImageStatus | "idle";

type AvatarImageProps = Omit<React.ComponentPropsWithRef<"img">, "src"> & {
  preload?: boolean;
  src?: string | Blob;
};

function setAvatarImageState(
  owner: HTMLElement | null,
  status: AvatarRootStatus,
) {
  const avatar = owner?.closest<HTMLElement>('[data-slot="avatar"]');

  if (avatar) {
    avatar.dataset.avatarImageState = status;
  }

  const fallback = avatar?.querySelector<HTMLElement>(
    '[data-slot="avatar-fallback"]',
  );

  if (fallback) {
    fallback.hidden = status === "loaded";
  }
}

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "cn-avatar group group/avatar relative flex size-8 shrink-0 select-none overflow-hidden rounded-full after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  alt,
  className,
  crossOrigin,
  onError,
  ref,
  referrerPolicy,
  sizes,
  src,
  srcSet,
  preload = true,
  ...props
}: AvatarImageProps) {
  const [loadState, setLoadState] = React.useState(() => ({
    crossOrigin,
    referrerPolicy,
    resolvedSrc: typeof src === "string" ? src : undefined,
    sizes,
    src,
    srcSet,
    status:
      src || srcSet
        ? preload
          ? ("loading" as AvatarImageStatus)
          : ("loaded" as AvatarImageStatus)
        : ("error" as AvatarImageStatus),
  }));
  const ownerRef = React.useRef<HTMLSpanElement>(null);
  const canLoad = preload && Boolean(src || srcSet);
  const matchesRequest =
    loadState.crossOrigin === crossOrigin &&
    loadState.referrerPolicy === referrerPolicy &&
    loadState.src === src &&
    loadState.srcSet === srcSet &&
    loadState.sizes === sizes;
  const status = !src && !srcSet
    ? "error"
    : canLoad
      ? matchesRequest
        ? loadState.status
        : "loading"
      : "loaded";

  React.useEffect(() => {
    if (!canLoad) return;

    let active = true;
    let objectUrl: string | undefined;
    const image = new window.Image();

    image.onload = () => {
      if (active) {
        setLoadState({
          crossOrigin,
          referrerPolicy,
          resolvedSrc: objectUrl ?? (typeof src === "string" ? src : undefined),
          sizes,
          src,
          srcSet,
          status: "loaded",
        });
      }
    };
    image.onerror = () => {
      if (active) {
        setLoadState({
          crossOrigin,
          referrerPolicy,
          resolvedSrc: undefined,
          sizes,
          src,
          srcSet,
          status: "error",
        });
        if (onError) {
          onError({ currentTarget: image, target: image } as unknown as React.SyntheticEvent<HTMLImageElement>);
        }
      }
    };
    image.crossOrigin = crossOrigin ?? null;
    image.referrerPolicy = referrerPolicy ?? "";
    image.sizes = sizes ?? "";
    image.srcset = srcSet ?? "";
    if (src instanceof Blob) {
      objectUrl = URL.createObjectURL(src);
      image.src = objectUrl;
    } else {
      image.src = src ?? "";
    }

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [canLoad, crossOrigin, referrerPolicy, sizes, src, srcSet]);

  React.useLayoutEffect(() => {
    const owner = ownerRef.current;
    setAvatarImageState(owner, status);

    return () => {
      setAvatarImageState(owner, "idle");
    };
  }, [crossOrigin, preload, referrerPolicy, sizes, src, srcSet, status]);

  return (
    <>
      <span
        ref={ownerRef}
        data-slot="avatar-image-status"
        hidden
        aria-hidden="true"
      />
      {status === "loaded" ? (
        <img
          alt={alt ?? ""}
          data-slot="avatar-image"
          className={cn(
            "cn-avatar-image aspect-square size-full rounded-full object-cover",
            className,
          )}
          data-state={status}
          crossOrigin={crossOrigin}
          onError={(event) => {
            setLoadState({
              crossOrigin,
              referrerPolicy,
              resolvedSrc: loadState.resolvedSrc,
              sizes,
              src,
              srcSet,
              status: "error",
            });
            onError?.(event);
          }}
          ref={ref}
          referrerPolicy={referrerPolicy}
          sizes={sizes}
          src={
            loadState.resolvedSrc ?? (typeof src === "string" ? src : undefined)
          }
          srcSet={srcSet}
          {...props}
        />
      ) : null}
    </>
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "cn-avatar-fallback flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground group-data-[size=sm]/avatar:text-xs group-data-[avatar-image-state=loaded]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "cn-avatar-badge absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "cn-avatar-group group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
