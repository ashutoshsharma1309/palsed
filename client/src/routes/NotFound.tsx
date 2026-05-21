import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <div className="display text-[18vw] sm:text-[200px] leading-none neon-text">404</div>
      <div className="mono text-xs uppercase tracking-[0.3em] text-white/40 mb-6">// no such route in this universe</div>
      <h1 className="display text-3xl mb-6">YOU WANDERED OFF THE MAP.</h1>
      <Link to="/dashboard"><Button>Back to dashboard</Button></Link>
    </div>
  );
}
