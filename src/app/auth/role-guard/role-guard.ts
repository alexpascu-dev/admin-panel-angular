import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../auth';

// helper comun
function checkRoles(allowed: string[] | undefined): true | UrlTree {
  const auth = inject(Auth);
  const router = inject(Router);

  // If there aren't declared roles on route, let user navigate
  if (!allowed || allowed.length === 0) return true;

  // Check current role
  const ok = auth.hasAnyRole(allowed);
  return ok ? true : router.createUrlTree(['/admin/users']); // redirect fallback
}

// For good routes
export const roleCanActivate: CanActivateFn = (route) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  return checkRoles(roles);
};

// For lazy routes ( no permision )
export const roleCanMatch: CanMatchFn = (route) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  return checkRoles(roles);
};