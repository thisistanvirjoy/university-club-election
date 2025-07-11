import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              A secure and transparent electronic voting system for university club elections.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/how-to-vote" className="hover:text-white transition-colors">
                  How to Vote
                </Link>
              </li>
              <li>
                <Link to="/election-rules" className="hover:text-white transition-colors">
                  Election Rules
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: tanvirjoym@gmail.com</li>
              <li>Phone: +8801812345678</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-2 text-red-500" /> by Tanvir Alam Khondaker
          </p>
        </div>
      </div>
    </footer>
  );
};