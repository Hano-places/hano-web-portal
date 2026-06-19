"use client";

import Link from "next/link";
import { useEffect, useId } from "react";
import { useAuthGate, type AuthAction } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import {
  FloatingPanelA11yTitle,
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelHeader,
  FloatingPanelRoot,
  useFloatingPanel,
} from "@/components/ui/floating-panel";
import panelStyles from "@/components/ui/floating-panel.module.css";

const ACTION_MESSAGES: Record<AuthAction, string> = {
  add_to_cart: "add items to your cart",
  checkout: "place your order",
  review: "leave a review",
  upload_moment: "share a moment",
  create_business: "create a business profile",
  view_orders: "view your orders",
  view_profile: "view your profile",
  save_wishlist: "save your favorites",
};

function LoginModalSync() {
  const { showLoginModal, closeLoginModal } = useAuthGate();
  const { openFloatingPanel, closeFloatingPanel, isOpen } = useFloatingPanel();

  useEffect(() => {
    if (showLoginModal) {
      openFloatingPanel(null, "Sign in to continue", "centered");
    }
  }, [showLoginModal, openFloatingPanel]);

  useEffect(() => {
    if (!showLoginModal && isOpen) {
      closeFloatingPanel();
    }
  }, [showLoginModal, isOpen, closeFloatingPanel]);

  useEffect(() => {
    if (!isOpen && showLoginModal) {
      closeLoginModal();
    }
  }, [isOpen, showLoginModal, closeLoginModal]);

  return null;
}

function LoginModalPanel() {
  const titleId = useId();
  const { showLoginModal, returnTo, closeLoginModal, pendingAction } = useAuthGate();
  const { isOpen } = useFloatingPanel();

  if (!showLoginModal && !isOpen) return null;

  const loginHref = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  const registerHref = `/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  const actionMessage = pendingAction
    ? ACTION_MESSAGES[pendingAction]
    : "complete this action";

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Sign in to continue</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          Sign in to continue
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="space-y-4">
          <p className="text-sm text-hano-muted">
            Create an account or log in to {actionMessage}.
          </p>
          <div className="flex flex-col gap-3">
            <Link href={loginHref} onClick={closeLoginModal}>
              <Button fullWidth>Log in</Button>
            </Link>
            <Link href={registerHref} onClick={closeLoginModal}>
              <Button variant="secondary" fullWidth>
                Create account
              </Button>
            </Link>
          </div>
        </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

export function LoginModal() {
  return (
    <FloatingPanelRoot>
      <LoginModalSync />
      <LoginModalPanel />
    </FloatingPanelRoot>
  );
}
