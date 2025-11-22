import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Write from "@/components/pages/Write";
import Library from "@/components/pages/Library";

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="text-center p-12">
          <div className="mb-8">
            <ApperIcon name="FileQuestion" size={80} className="text-secondary mx-auto mb-6" />
            <h1 className="font-display text-4xl font-bold text-primary mb-4">Page Not Found</h1>
            <p className="text-secondary font-ui text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <ApperIcon name="Home" size={16} className="mr-2" />
              Go Home
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-surface">
            <p className="text-sm text-secondary font-ui mb-4">
              Looking for something specific?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/library">
                <Button variant="ghost" size="sm" className="w-full">
                  My Library
                </Button>
              </Link>
              <Link to="/write">
                <Button variant="ghost" size="sm" className="w-full">
                  Write Stories
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
);
};

export default NotFound;