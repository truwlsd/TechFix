import { Link } from "react-router-dom";
import { ChevronRight, Clock, Package, Zap } from "lucide-react";
import type { Order } from "../../types/domain";
import { OrderCard } from "./OrderCard";

interface OrdersTabProps {
  userOrders: Order[];
  expandedOrderId: string | null;
  onToggleOrder: (id: string | null) => void;
}

export function OrdersTab({ userOrders, expandedOrderId, onToggleOrder }: OrdersTabProps) {
  const activeOrders = userOrders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const historyOrders = userOrders.filter((o) => ["completed", "cancelled"].includes(o.status));

  return (
    <div className="space-y-6 animate-fadeIn">
      {activeOrders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-white/40" />
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Активные ({activeOrders.length})
            </h2>
          </div>
          <div className="space-y-3">
            {activeOrders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                expanded={expandedOrderId === o.id}
                onToggle={() =>
                  onToggleOrder(expandedOrderId === o.id ? null : o.id)
                }
              />
            ))}
          </div>
        </div>
      )}

      {historyOrders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-white/25" />
            <h2 className="text-xs font-semibold text-white/25 uppercase tracking-wider">
              История
            </h2>
          </div>
          <div className="space-y-3">
            {historyOrders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                expanded={expandedOrderId === o.id}
                onToggle={() =>
                  onToggleOrder(expandedOrderId === o.id ? null : o.id)
                }
              />
            ))}
          </div>
        </div>
      )}

      {userOrders.length === 0 && (
        <div
          className="rounded-2xl py-20 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Package className="w-10 h-10 text-white/15 mx-auto mb-4" />
          <p className="text-white/30 font-medium mb-2">Пока нет заказов</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white transition-colors"
          >
            Перейти к услугам <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
