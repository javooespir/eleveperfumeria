import { LogOut } from "lucide-react";
import { logoutAction } from "./actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <LogOut className="size-4" />
        Salir
      </button>
    </form>
  );
}
