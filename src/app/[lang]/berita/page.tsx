import { redirect } from "next/navigation";

export default async function LocalizedNewsListRedirect({ params }: { params: { lang: string } }) {
  redirect(`/${params.lang}`);
}
