import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  getAdminSiteSettings,
  resolveMediaUrl,
  updateAdminSiteSettings,
  uploadSiteSettingsLogo,
} from "../../api";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const EMPTY_FORM = {
  logo: "",
  address: "",
  phone: "",
  email: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
  },
};

export default function AdminSettings() {
  const { refreshSettings } = useSiteSettings();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAdminSiteSettings();
        if (!active) return;
        setFormData({
          logo: data?.logo || "",
          address: data?.address || "",
          phone: data?.phone || "",
          email: data?.email || "",
          socialLinks: {
            facebook: data?.socialLinks?.facebook || "",
            instagram: data?.socialLinks?.instagram || "",
            twitter: data?.socialLinks?.twitter || "",
            youtube: data?.socialLinks?.youtube || "",
            whatsapp: data?.socialLinks?.whatsapp || "",
          },
        });
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load site settings");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const updateSocial = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: event.target.value,
      },
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    setUploadingLogo(true);
    try {
      const { data } = await uploadSiteSettingsLogo(form);
      const imagePath = data?.image || "";
      if (!imagePath) {
        toast.error("Logo upload failed");
        return;
      }
      setFormData((current) => ({ ...current, logo: imagePath }));
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateAdminSiteSettings(formData);
      await refreshSettings();
      toast.success("Site settings updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save site settings");
      toast.error(err?.response?.data?.message || "Failed to save site settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="font-display text-xl font-bold text-teal">Site Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the frontend logo, contact details, and social links from the admin panel.
          </p>
        </div>

        {loading ? <div className="p-6 text-sm text-gray-500">Loading settings...</div> : null}
        {error && !loading ? <div className="p-6 text-sm text-red-500">{error}</div> : null}

        {!loading && (
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-teal">Branding</h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={updateField("logo")}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    placeholder="/uploads/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Upload Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadingLogo ? "Uploading logo..." : "Upload JPG, PNG, WEBP, GIF or AVIF up to 5MB"}
                  </p>
                </div>
                {formData.logo ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveMediaUrl(formData.logo)}
                      alt="Site logo preview"
                      className="w-16 h-16 rounded-xl object-contain border border-gray-200 bg-white"
                    />
                    <span className="text-xs text-gray-500 break-all">{formData.logo}</span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-teal">Contact</h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={updateField("address")}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    placeholder="Full business address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={updateField("phone")}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    placeholder="+91 8778958663"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={updateField("email")}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    placeholder="vaigaitourism@gmail.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-teal mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={updateSocial("facebook")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={updateSocial("instagram")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  placeholder="Instagram URL"
                />
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={updateSocial("twitter")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  placeholder="Twitter URL"
                />
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={updateSocial("youtube")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  placeholder="YouTube URL"
                />
                <input
                  type="url"
                  value={formData.socialLinks.whatsapp}
                  onChange={updateSocial("whatsapp")}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm md:col-span-2"
                  placeholder="WhatsApp URL"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || uploadingLogo}
                className="btn-primary text-sm py-2.5 px-6 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
