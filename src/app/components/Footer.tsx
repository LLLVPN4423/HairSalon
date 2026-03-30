import { Phone, MapPin, Clock, Facebook, Instagram, MessageCircle, Music } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export default function Footer() {

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              Liên hệ
            </h3>
            <div className="space-y-2 text-neutral-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-white font-medium">{siteConfig.contact_phone || 'Updating...'}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-white font-medium">{siteConfig.contact_address || 'Updating...'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-white font-medium">{siteConfig.working_hours || 'Updating...'}</span>
              </p>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Về {siteConfig.salon_name || 'Salon'}
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              {siteConfig.about_description || 'Updating...'}
            </p>
            <p className="text-amber-500 font-medium mt-2">
              {siteConfig.tagline || 'Updating...'}
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Theo dõi chúng tôi
            </h3>
            <div className="space-y-3">
              {siteConfig.facebook_link && (
                <a
                  href={siteConfig.facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-amber-500 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
              )}
              {siteConfig.instagram_link && (
                <a
                  href={siteConfig.instagram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-amber-500 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              )}
              {siteConfig.tiktok_link && (
                <a
                  href={siteConfig.tiktok_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-amber-500 transition-colors"
                >
                  <Music className="w-5 h-5" />
                  TikTok
                </a>
              )}
              {siteConfig.zalo_link && (
                <a
                  href={siteConfig.zalo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-amber-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Zalo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400 text-sm">
            © 2024 {siteConfig.salon_name || 'Salon'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
