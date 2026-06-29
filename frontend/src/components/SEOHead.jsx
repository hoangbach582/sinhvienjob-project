import { useEffect } from 'react';

function SEOHead({ title, description, image, url }) {
  useEffect(() => {
    // Cập nhật title
    if (title) {
      document.title = `${title} | SinhVienJob`;
    }

    // Cập nhật meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }

    // Cập nhật og:title
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${title} | SinhVienJob`);
      } else {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.content = `${title} | SinhVienJob`;
        document.head.appendChild(ogTitle);
      }
    }

    // Cập nhật og:description
    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      } else {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        ogDesc.content = description;
        document.head.appendChild(ogDesc);
      }
    }

    // Cập nhật og:image
    if (image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', image);
      } else {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.content = image;
        document.head.appendChild(ogImage);
      }
    }
    
    // Cleanup function để reset lại khi component unmount
    return () => {
      document.title = "SinhVienJob - Nền tảng tìm việc làm sinh viên số 1 Việt Nam";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', "Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường dành cho sinh viên Việt Nam.");
      }
    };
  }, [title, description, image, url]);

  return null; // Component này không render UI
}

export default SEOHead;
