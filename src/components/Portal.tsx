"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Rend ses enfants au niveau de <body> via un portail.
 *
 * Indispensable pour les modales en `position: fixed` : le <header> applique
 * un `backdrop-filter` (backdrop-blur), ce qui crée un bloc conteneur pour les
 * descendants `fixed`. Sans portail, une modale rendue dans le header serait
 * dimensionnée par rapport au header (64px de haut) et non au viewport.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
