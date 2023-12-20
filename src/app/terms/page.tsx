import React from "react";
import Markdown from "react-markdown";
type Props = {};
//style for this page just to style h1, h2 and p tags

const page = (props: Props) => {
  return (
    <div className="min-h-screen container markdown my-16">
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export default page;

const markdown = `# Terms of Use

## 1. Acceptance of Terms

By accessing and using this website (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

## 2. Intellectual Property

The Service and its original content, features, and functionality are owned by SongSculpt and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.

## 3. Use License

Permission is granted to temporarily download one copy of any downloadable materials on the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials;
- Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
- Attempt to decompile or reverse engineer any software contained on the Service;
- Remove any copyright or other proprietary notations from the materials; or
- Transfer the materials to another person or "mirror" the materials on any other server.

## 4. Limitations

In no event shall SongSculpt be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if SongSculpt or an authorized representative has been notified orally or in writing of the possibility of such damage.

## 5. Revisions and Errata

The materials appearing on the Service could include technical, typographical, or photographic errors. SongSculpt does not warrant that any of the materials on the Service are accurate, complete, or current.

## 6. Changes to this Agreement

SongSculpt reserves the right to modify these Terms of Service at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.

## 7. Governing Law

This Agreement (and any further rules, policies, or guidelines incorporated by reference) shall be governed and construed in accordance with the laws of the United States, without giving effect to any principles of conflicts of law.

## 8. Contact Us

If you have any questions about this Agreement, please feel free to contact us.
`;
