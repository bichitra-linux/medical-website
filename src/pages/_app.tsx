import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import AdminLayout from "@/components/layout/admin-layout";

const useLayout = (Component: any) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin') && 
                      !router.pathname.includes('/admin/login') && 
                      !router.pathname.includes('/admin/register');
  
  // Check if component has getLayout function defined
  if (Component.getLayout) {
    return Component.getLayout;
  }
  
  // For admin routes, use AdminLayout
  if (isAdminRoute) {
    return (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
  }
  
  // For other routes, use default Layout
  return (page: React.ReactNode) => <Layout>{page}</Layout>;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const getLayout = useLayout(Component);
  
  return (
    <ClerkProvider 
      {...pageProps}
      navigateUrl={router.pathname === "/admin/login" ? "/admin/dashboard" : undefined}
    >
      {getLayout(<Component {...pageProps} />)}
    </ClerkProvider>
  );
}