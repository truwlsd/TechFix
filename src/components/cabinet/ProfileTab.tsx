import { useState } from "react";
import { Edit2, Save, Shield, X } from "lucide-react";
import { useStore } from "../../store/useStore";
import type { User } from "../../types/domain";
import { LEVEL_CONFIG } from "./constants";
import { formatDate } from "./formatDate";

interface ProfileTabProps {
  currentUser: User;
}

export function ProfileTab({ currentUser }: ProfileTabProps) {
  const { updateUser } = useStore();
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [profileError, setProfileError] = useState("");

  const levelCfg = LEVEL_CONFIG[currentUser.bonusLevel];

  const validateProfile = () => {
    const normalizedName = editForm.name.trim().replace(/\s+/g, " ");
    const phoneDigits = editForm.phone.replace(/\D/g, "");
    if (normalizedName.length < 2) return "Введите корректное имя";
    if (phoneDigits.length < 11 || !phoneDigits.startsWith("7")) {
      return "Введите телефон в формате +7XXXXXXXXXX";
    }
    return "";
  };

  const startEdit = () => {
    setEditForm({ name: currentUser.name, phone: currentUser.phone });
    setProfileError("");
    setEditMode(true);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Личные данные</h3>
          {!editMode ? (
            <button
              type="button"
              onClick={startEdit}
              className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Изменить
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  const validationError = validateProfile();
                  if (validationError) {
                    setProfileError(validationError);
                    return;
                  }
                  const result = await updateUser({
                    name: editForm.name.trim().replace(/\s+/g, " "),
                    phone: editForm.phone.trim(),
                  });
                  if (result.ok) {
                    setProfileError("");
                    setEditMode(false);
                  } else {
                    setProfileError(result.message || "Не удалось сохранить профиль");
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <Save className="w-4 h-4" /> Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileError("");
                  setEditMode(false);
                }}
                className="text-white/25 hover:text-white/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(
            [
              {
                key: "name" as const,
                label: "Имя и фамилия",
                editable: true,
                val: editMode ? editForm.name : currentUser.name,
              },
              {
                key: "email" as const,
                label: "Email",
                editable: false,
                val: currentUser.email,
              },
              {
                key: "phone" as const,
                label: "Телефон",
                editable: true,
                val: editMode ? editForm.phone : currentUser.phone,
              },
              {
                key: "registeredAt" as const,
                label: "Дата регистрации",
                editable: false,
                val: formatDate(currentUser.registeredAt),
              },
            ] as const
          ).map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-white/25 uppercase tracking-wider mb-1.5">
                {f.label}
              </label>
              {editMode && f.editable ? (
                <input
                  value={f.key === "name" ? editForm.name : editForm.phone}
                  onChange={(e) => {
                    setProfileError("");
                    if (f.key === "name" || f.key === "phone") {
                      setEditForm((prev) => ({ ...prev, [f.key]: e.target.value }));
                    }
                  }}
                  maxLength={f.key === "phone" ? 20 : 80}
                  className="input-dark"
                />
              ) : (
                <div
                  className="px-4 py-3 rounded-xl text-sm text-white/50"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {f.val}
                </div>
              )}
            </div>
          ))}
        </div>

        {editMode && profileError && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
            {profileError}
          </div>
        )}

        <div
          className="mt-6 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/25 uppercase tracking-wider mb-1">Уровень</p>
              <p className="text-white font-semibold">
                {levelCfg.icon} {levelCfg.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/25 mb-1">Бонусов</p>
              <p className="text-white font-bold">{currentUser.bonusBalance}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 flex items-start gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Shield className="w-5 h-5 text-white/25 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-white/50 font-medium">Безопасность аккаунта</p>
          <p className="text-xs text-white/25 mt-0.5 leading-relaxed">
            Ваши данные защищены. Никогда не передавайте пароль третьим лицам.
          </p>
        </div>
      </div>
    </div>
  );
}
