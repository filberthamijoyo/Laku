import Image from 'next/image';
import XiaohongshuPost from '@/components/explore/XiaohongshuPost';
import { productsData } from '@/lib/products-data';
import { Store } from '@/types/store';
import { Fragment, useMemo, useState, useRef, useEffect } from 'react';

interface MobileStoreTagsProps {
  store: Store;
}

export default function MobileStoreTags({ store }: MobileStoreTagsProps) {
  const [activeDivision, setActiveDivision] = useState<'post' | 'tags'>('post');

  // Collect posts (productsData) where the post tags mention the store name or slug (tagged by users)
  const taggedPosts = useMemo(() => {
    return Object.values(productsData)
      .filter((p) => {
        const tags = p.postData?.tags || [];
        const lowerStoreName = store.name?.toLowerCase() || '';
        const lowerStoreSlug = (store.id || '').replace(/^store-/, '').toLowerCase();
        return tags.some((t: string) => {
          const lowerTag = t.toLowerCase();
          return lowerTag.includes(lowerStoreName) || lowerTag.includes(lowerStoreSlug);
        });
      })
      .map((p) => ({
        id: p.slug || p.id,
        image: p.postImages?.[0] || p.productImages?.[0] || '',
        title: p.postData?.title || p.name,
        author: {
          username: p.postData?.author?.name || 'Unknown',
          avatar: p.postData?.author?.avatar || '/avatars/default.png',
        },
        likes: p.postData?.interactions?.likes || 0,
      }));
  }, [store]);

  // Collect posts authored by the store itself (if available)
  const storePosts = useMemo(() => {
    const lowerStoreName = store.name?.toLowerCase() || '';
    return Object.values(productsData)
      .filter((p) => {
        const authorName = p.postData?.author?.name || '';
        return authorName.toLowerCase() === lowerStoreName;
      })
      .map((p) => ({
        id: p.slug || p.id,
        image: p.postImages?.[0] || p.productImages?.[0] || '',
        title: p.postData?.title || p.name,
        author: {
          username: p.postData?.author?.name || 'Unknown',
          avatar: p.postData?.author?.avatar || '/avatars/default.png',
        },
        likes: p.postData?.interactions?.likes || 0,
      }));
  }, [store]);

  const currentPosts = activeDivision === 'tags' ? taggedPosts : storePosts;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const onTouchStart = (e: any) => {
    touchEndX.current = null;
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onTouchMove = (e: any) => {
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onTouchEnd = (e: any) => {
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    if (touchStartX.current === null) return;
    const endX = touchEndX.current ?? x;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    touchEndX.current = null;
    if (delta > SWIPE_THRESHOLD) {
      // swipe right -> move content right: go to left pane (post)
      if (activeDivision === 'tags') setActiveDivision('post');
    } else if (delta < -SWIPE_THRESHOLD) {
      // swipe left -> move content left: go to right pane (tags)
      if (activeDivision === 'post') setActiveDivision('tags');
    }
  };

  // TagsDivisionInner mirrors ProductDivisionInner behavior for tabs + touch
  function TagsDivisionInner({ active, onChange }: { active: 'post' | 'tags'; onChange?: (v: 'post' | 'tags') => void }) {
    // Simple swipe handler
    const [touchStart, setTouchStart] = useState<number | null>(null);
    // Sticky state - becomes sticky when scrolled past the fixed header (56px)
    const [isSticky, setIsSticky] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const originalTopRef = useRef<number | null>(null);

    useEffect(() => {
      const handleScroll = () => {
        if (containerRef.current) {
          // Store the original top position on first load
          if (originalTopRef.current === null) {
            originalTopRef.current = containerRef.current.getBoundingClientRect().top + window.scrollY;
          }
          
          // Calculate scroll position relative to original position
          const scrollY = window.scrollY;
          const threshold = originalTopRef.current - 56; // 56px is the fixed header height
          
          // Be sticky when scrolled past the threshold (scrollY > threshold)
          // Remove sticky when scrolled back to top (scrollY <= threshold)
          setIsSticky(scrollY > threshold);
        }
      };

      // Store original position on mount
      if (containerRef.current && originalTopRef.current === null) {
        originalTopRef.current = containerRef.current.getBoundingClientRect().top + window.scrollY;
      }

      // Check initial position
      handleScroll();

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // swiped left -> go to 'tags'
          if (active !== 'tags') onChange?.('tags');
        } else {
          // swiped right -> go to 'post'
          if (active !== 'post') onChange?.('post');
        }
      }
      setTouchStart(null);
    };

    return (
      <>
        {/* Spacer to reserve space when sticky - only render when sticky */}
        {isSticky && <div className="h-[50px] bg-white" />}
        
        <div 
          ref={containerRef}
          className={`flex border-b border-gray-200 bg-white transition-all duration-300 ${
            isSticky ? 'fixed top-14 left-0 right-0 z-40' : 'relative'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => onChange?.('post')}
            className={`flex-1 py-[1px] h-[50px] text-center transition-colors ${
              active === 'post' ? 'text-gray-900 border-b-2 border-red-600 font-semibold' : 'text-gray-600/50'
            }`}
          >
            Post
          </button>

          <button
            onClick={() => onChange?.('tags')}
            className={`flex-1 py-[1px] h-[50px] text-center transition-colors ${
              active === 'tags' ? 'text-gray-900 border-b-2 border-red-600 font-semibold' : 'text-gray-600/50'
            }`}
          >
            Tags
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 rounded-t-xl overflow-visible">
      {/* Division tabs: Post / Tags */}
      <div className="bg-white">
        <TagsDivisionInner active={activeDivision} onChange={setActiveDivision} />
      </div>

      {/* Swipeable content: left = tags, right = post */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onTouchStart}
        onPointerUp={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
      <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              width: '200%',
              transition: 'transform 320ms ease',
              transform: activeDivision === 'post' ? 'translateX(0%)' : 'translateX(-50%)',
            }}
          >
            {/* Post pane (store-authored posts) - left */}
            <div style={{ width: '50%' }} className="px-1 py-1.5">
              {storePosts.length === 0 ? (
                <div className="p-4 text-center text-gray-600">No posts by this store.</div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {storePosts.map((post) => (
                    <Fragment key={post.id}>
                      <div className="block w-full">
                        <XiaohongshuPost post={post as any} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Tags pane - right */}
            <div style={{ width: '50%' }} className="px-1 py-1.5">
              {taggedPosts.length === 0 ? (
                <div className="p-4 text-center text-gray-600">No tagged posts found for this store.</div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {taggedPosts.map((post) => (
                    <Fragment key={post.id}>
                      <div className="block w-full">
                        <XiaohongshuPost post={post as any} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

