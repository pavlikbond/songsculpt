"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MessageDisplay from "@/components/MessageDisplay";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {};

const Contact = (props: Props) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    console.log(e.target.message.value);

    // https://github.com/github/fetch
    fetch("https://formsubmit.co/ajax/bf8ccb78dcfa78bcf9219843dd68e957", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: "FormSubmit",
        message: e.target.message.value,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setMessage({ message: "Success!", type: "success" });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch((error) => {
        setMessage({ message: "An error has occured, please try again", type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container max-w-sm flex flex-col gap-4 my-20 bg-slate-100 shadow p-8 rounded ">
      <h1 className="text-center font-semibold text-2xl">Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <Textarea placeholder="Your Message" className="form-control h-36" name="message" required></Textarea>
        <Button type="submit" className="mt-4 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" size={24} />}
          Submit
        </Button>
        {message && (
          <MessageDisplay responseMessage={{ message: message.message, type: message.type }}></MessageDisplay>
        )}
      </form>
    </div>
  );
};

export default Contact;
