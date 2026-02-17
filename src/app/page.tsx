import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-10">
      <section className="mx-auto w-full max-w-4xl text-center py-12 md:py-24 space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-7xl font-serif">
          Eat well, plan better.
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed">
          Automated weekly meal planning for Ciara & Daniel. organize your recipes,
          manage your pantry, and generate shopping lists with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/planner"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Start Planning
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background/50 px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {/* Feature Cards */}
        {[
          {
            title: "Smart Planning",
            description: "Generate a weekly meal plan based on your preferences.",
            href: "/planner",
            icon: "📅",
          },
          {
            title: "Recipe Collection",
            description: "Store and organize your favorite recipes in one place.",
            href: "/recipes",
            icon: "📖",
          },
          {
            title: "Shopping List",
            description: "Automatically generate a shopping list from your meal plan.",
            href: "/shopping-list",
            icon: "🛒",
          },
        ].map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex flex-col gap-2">
              <span className="text-3xl mb-2">{feature.icon}</span>
              <h3 className="font-serif text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
