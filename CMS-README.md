# 📋 Dynamic Site Configuration (CMS System)

This Hair Salon Landing Page now supports dynamic configuration via Google Sheets CSV, allowing you to update content without touching code.

## 🚀 Quick Setup

### 1. Prepare Google Sheets

1. **Create Google Sheet**: [Google Sheets](https://sheets.new)
2. **Set Columns**: Only 2 columns needed:
   - Column A: `key` (Configuration keys)
   - Column B: `value` (Configuration values)

3. **Add Configuration Rows**:

| key | value |
|-----|--------|
| hero_title | Luxe Studio |
| hero_subtitle | Elevate your style with premium grooming... |
| hero_image_url | https://images.unsplash.com/... |
| about_text | Welcome to Luxe Studio... |
| contact_phone | (555) 123-4567 |
| contact_address | 123 Fashion Street, Style District, NY 10001 |
| working_hours | Mon-Sat: 9:00 AM - 8:00 PM... |
| facebook_link | https://facebook.com/luxestudio |
| instagram_link | https://instagram.com/luxestudio |
| tiktok_link | https://tiktok.com/@luxestudio |
| zalo_link | https://zalo.me/123456789 |
| salon_name | Luxe Studio |
| tagline | Premium Grooming & Style |

### 2. Publish as CSV

1. **File → Share → Publish to web**
2. **Link**: Copy the published CSV URL
3. **Format**: `https://docs.google.com/spreadsheets/d/e/SHEET_ID/pub?output=csv`

### 3. Update Environment

Add to your `.env` file:
```bash
VITE_CONFIG_CSV_URL=https://docs.google.com/spreadsheets/d/e/SHEET_ID/pub?output=csv
```

### 4. Restart Development

```bash
npm run dev
```

## 🎯 Supported Configuration Keys

### **Hero Section**
- `hero_title` - Main salon name (splits on space for styling)
- `hero_subtitle` - Tagline under the title
- `hero_image_url` - Background image URL

### **Contact Information**
- `contact_phone` - Phone number for contact
- `contact_address` - Physical address
- `working_hours` - Business hours

### **Social Media**
- `facebook_link` - Facebook profile URL
- `instagram_link` - Instagram profile URL
- `tiktok_link` - TikTok profile URL
- `zalo_link` - Zalo contact URL

### **Branding**
- `salon_name` - Salon name (used in headers)
- `tagline` - Business tagline

## 🔄 How It Works

### **Default Fallback**
If `VITE_CONFIG_CSV_URL` is not set, the system uses hardcoded defaults that match the original design.

### **Dynamic Loading**
1. System checks for `VITE_CONFIG_CSV_URL`
2. Fetches CSV from Google Sheets
3. Parses key-value pairs
4. Updates React context with new values
5. UI components automatically re-render with new content

### **Real-time Updates**
- Change any value in Google Sheets
- Save the sheet
- Refresh browser → Changes appear instantly
- No redeployment needed

## 🎨 Components Using Dynamic Config

### **Home Page**
- ✅ Hero section (title, subtitle, image)
- ✅ Navigation cards
- ✅ Featured sections
- ✅ Footer with contact info

### **Booking Page**
- ✅ Header with salon name
- ✅ Service listings

### **Shop Page**
- ✅ Header with salon name
- ✅ Product listings

### **Footer Component**
- ✅ Contact information
- ✅ Social media links
- ✅ About section
- ✅ Copyright

## 📝 Example CSV Content

```csv
key,value
hero_title,"Luxe Studio"
hero_subtitle,"Elevate your style with premium grooming and exclusive hair care collections."
hero_image_url,"https://images.unsplash.com/photo-1769034260387-39fa07f0c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
about_text,"Welcome to Luxe Studio, where style meets sophistication."
contact_phone,"(555) 123-4567"
contact_address,"123 Fashion Street, Style District, NY 10001"
working_hours,"Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM"
facebook_link,"https://facebook.com/luxestudio"
instagram_link,"https://instagram.com/luxestudio"
salon_name,"Luxe Studio"
tagline,"Premium Grooming & Style"
```

## 🚀 Benefits

- **No Code Changes**: Update content via Google Sheets
- **Instant Updates**: Changes appear when you refresh
- **Client Control**: Non-technical users can manage content
- **Version Control**: Google Sheets maintains change history
- **Collaboration**: Multiple users can edit the sheet
- **Zero Downtime**: No redeployment needed for content changes

## 🛠️ Troubleshooting

### **Changes Not Appearing**
1. Check Google Sheet is published to web
2. Verify CSV URL in `.env`
3. Check browser console for errors
4. Ensure CSV format (key,value)

### **Image Not Loading**
1. Verify image URL is accessible
2. Check image format (JPG, PNG, etc.)
3. Test image URL in browser directly

---

**Your Hair Salon Landing Page is now a fully dynamic CMS-powered website!** 🎉
