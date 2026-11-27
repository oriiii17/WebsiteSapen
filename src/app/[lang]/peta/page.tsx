import { redirect } from "next/navigation";

export default async function LocalizedMapRedirect({ params }: { params: { lang: string } }) {
  redirect(`/${params.lang}`);
}
