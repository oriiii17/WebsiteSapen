import { redirect } from "next/navigation";

export default async function LocalizedAgendaRedirect({ params }: { params: { lang: string } }) {
  redirect(`/${params.lang}`);
}
