import WaveField from "@/components/ui/wave-field";

export default function DemoPage() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <WaveField headline="HARMONIC" />
      </div>
    </div>
  );
}
