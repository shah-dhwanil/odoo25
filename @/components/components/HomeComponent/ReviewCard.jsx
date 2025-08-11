
import { Card, CardContent } from "../../ui/card";
import { Star } from "lucide-react";

function ReviewCard({ review }) {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <img
            src={review.image || "/placeholder.svg"}
            alt={review.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/20"
          />
          <h3 className="text-xl font-bold text-white mb-2">{review.name}</h3>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
            ))}
          </div>
        </div>
        <blockquote className="text-lg text-blue-100 italic leading-relaxed">
          "{review.text}"
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
