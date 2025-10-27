import { ExternalLink } from "lucide-react";

const Footer = () => {
  const resources = [
    { name: "Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
    { name: "AI For Everyone - Coursera", url: "https://www.coursera.org/learn/ai-for-everyone" },
    { name: "Elements of AI", url: "https://www.elementsofai.com/" },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-muted/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              AI Explorers
            </h3>
            <p className="text-sm text-muted-foreground">
              Making AI education fun and accessible for high school students. Learn, play, and explore the future of technology!
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Learning Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {resource.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About This Project</h4>
            <p className="text-sm text-muted-foreground">
              Built with React, Tailwind CSS, and Framer Motion. Designed to inspire the next generation of AI enthusiasts.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © 2025 AI Explorers. Made for learning and exploration.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
