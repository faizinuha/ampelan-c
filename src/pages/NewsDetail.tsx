
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useNews } from '@/hooks/useNews';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getAllNews } = useNews();
  const allNews = getAllNews();
  
  const news = allNews.find(item => item.id === id);

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
              <p className="text-gray-600 mb-6">Maaf, berita yang Anda cari tidak dapat ditemukan.</p>
              <Link to="/news">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Berita
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/news">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Berita
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          {news.image_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(news.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{news.author_name}</span>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {news.title}
            </CardTitle>
            
            {news.excerpt && (
              <p className="text-lg text-gray-600 mt-4">
                {news.excerpt}
              </p>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {news.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsDetail;
