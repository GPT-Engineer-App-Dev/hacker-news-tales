import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const StoryCard = ({ story }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <h2 className="text-lg font-semibold mb-2">{story.title}</h2>
      <p className="text-sm text-gray-500">Points: {story.points}</p>
    </CardContent>
    <CardFooter>
      <Button
        variant="link"
        asChild
        className="p-0"
      >
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </Button>
    </CardFooter>
  </Card>
);

const SkeletonCard = () => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-1/4" />
    </CardFooter>
  </Card>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories
  });

  const filteredStories = data?.hits.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Hacker News Top 100 Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />
      {isLoading ? (
        Array(10)
          .fill()
          .map((_, index) => <SkeletonCard key={index} />)
      ) : (
        filteredStories?.map((story) => (
          <StoryCard key={story.objectID} story={story} />
        ))
      )}
    </div>
  );
};

export default Index;