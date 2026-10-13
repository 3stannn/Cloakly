import { useEffect, useRef } from "react";
import { BrowserRouter, Link, matchPath, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Simulation from "./components/Simulation";
import FeatureGrid from "./components/FeatureGrid";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import EducationLayout from "./components/EducationLayout";
import LearnIndex from "./pages/LearnIndex";
import TopicLesson from "./pages/TopicLesson";
import QuizPage from "./pages/QuizPage";
import { ArticleRoute, BlogIndex } from "./pages/BlogPages";
import { getArticle } from "./data/articles";
import { getTopic } from "./data/topics";
import "./App.css";
import "./learning.css";

function HomePage() {
  return (
    <div className="app-shell">
      <section className="landing-stage">
        <Navbar />
        <Hero />
        <TrustStrip />
      </section>
      <main>
        <Simulation />
        <FeatureGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

function UnknownPage() {
  const { pathname } = useLocation();
  const inBlog = pathname.startsWith("/blog");
  return (
    <EducationLayout>
      <div className="not-found-panel">
        <span className="eyebrow">Page not found</span>
        <h1 id="page-heading" tabIndex={-1}>We couldn’t find that page.</h1>
        <p>Use one of the learning hub indexes to find a current lesson or article.</p>
        <div className="not-found-actions">
          <Link className="button button-primary" to={inBlog ? "/blog" : "/learn"}>{inBlog ? "Back to Blog" : "Back to Learn"}</Link>
          <Link className="text-link" to="/">Go to Home</Link>
        </div>
      </div>
    </EducationLayout>
  );
}

function getRouteMeta(pathname) {
  const routePath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (routePath === "/") {
    return { title: "Cloakly — Know the threat", description: "Cloakly uses interactive cybersecurity simulations to help people recognize and respond to digital threats." };
  }
  if (routePath === "/learn") {
    return { title: "Learn | Cloakly", description: "Learn about synthetic media, responsible sharing, and adversarial perturbations with short lessons and quizzes." };
  }
  if (routePath === "/blog") {
    return { title: "Blog | Cloakly", description: "Read sourced explainers on privacy, synthetic media, and the limits of image protection research." };
  }
  const quizMatch = matchPath({ path: "/learn/:topicSlug/quiz", end: true }, routePath);
  if (quizMatch) {
    const topic = getTopic(quizMatch.params.topicSlug);
    return topic
      ? { title: topic.title + " quiz | Cloakly", description: "Check your understanding of " + topic.title.toLowerCase() + " with a short quiz." }
      : { title: "Quiz not found | Cloakly", description: "Choose a current topic from the Cloakly learning hub." };
  }
  const topicMatch = matchPath({ path: "/learn/:topicSlug", end: true }, routePath);
  if (topicMatch) {
    const topic = getTopic(topicMatch.params.topicSlug);
    return topic
      ? { title: topic.title + " | Learn | Cloakly", description: topic.summary }
      : { title: "Lesson not found | Cloakly", description: "Choose a current topic from the Cloakly learning hub." };
  }
  const articleMatch = matchPath({ path: "/blog/:articleSlug", end: true }, routePath);
  if (articleMatch) {
    const article = getArticle(articleMatch.params.articleSlug);
    return article
      ? { title: article.title + " | Cloakly", description: article.summary }
      : { title: "Article not found | Cloakly", description: "Choose a current article from the Cloakly blog." };
  }
  return { title: "Page not found | Cloakly", description: "Find learning topics and sourced articles from Cloakly." };
}

function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef(null);
  const pendingHashFocus = useRef(false);

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.append(description);
    }
    description.content = meta.description;

    const pathChanged = previousPath.current !== null && previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    if (pathChanged) {
      if (location.hash) pendingHashFocus.current = true;
      else document.getElementById("page-heading")?.focus();
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return undefined;
    let targetId = location.hash.slice(1);
    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      pendingHashFocus.current = false;
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (!target) {
        pendingHashFocus.current = false;
        return;
      }
      target.scrollIntoView({ block: "start" });
      if (pendingHashFocus.current) {
        const heading = target.querySelector("h1, h2, h3");
        if (heading && !heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
        pendingHashFocus.current = false;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnIndex />} />
        <Route path="/learn/:topicSlug/quiz" element={<QuizPage />} />
        <Route path="/learn/:topicSlug" element={<TopicLesson />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:articleSlug" element={<ArticleRoute />} />
        <Route path="*" element={<UnknownPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
