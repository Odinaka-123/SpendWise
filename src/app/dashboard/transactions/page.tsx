"use client";

import { useState, useMemo } from "react";
import { Download, Plus } from "lucide-react";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable, {
  TxRow,
} from "../components/transactions/TransactionTable";
import TransactionModal, {
  TransactionFormData,
} from "../components/transactions/TransactionModal";

const seed: TxRow[] = [
  {
    id: "1",
    name: "Shoprite Ikeja",
    category: "Groceries",
    amount: "4350",
    date: "2026-05-08",
    type: "debit",
    icon: "Groceries",
    notes: "",
  },
  {
    id: "2",
    name: "Bolt ride",
    category: "Transport",
    amount: "1200",
    date: "2026-05-08",
    type: "debit",
    icon: "Transport",
    notes: "Morning commute",
  },
  {
    id: "3",
    name: "Salary credit",
    category: "Income",
    amount: "200000",
    date: "2026-05-07",
    type: "credit",
    icon: "Income",
    notes: "",
  },
  {
    id: "4",
    name: "Chicken Republic",
    category: "Dining",
    amount: "3800",
    date: "2026-05-07",
    type: "debit",
    icon: "Dining",
    notes: "",
  },
  {
    id: "5",
    name: "Netflix",
    category: "Entertainment",
    amount: "4600",
    date: "2026-05-07",
    type: "debit",
    icon: "Entertainment",
    notes: "Monthly sub",
  },
  {
    id: "6",
    name: "EKEDC Bill",
    category: "Utility",
    amount: "8500",
    date: "2026-05-06",
    type: "debit",
    icon: "Utility",
    notes: "",
  },
  {
    id: "7",
    name: "Rent payment",
    category: "Housing",
    amount: "35000",
    date: "2026-05-01",
    type: "debit",
    icon: "Housing",
    notes: "May rent",
  },
  {
    id: "8",
    name: "Tantalizers",
    category: "Dining",
    amount: "2200",
    date: "2026-05-05",
    type: "debit",
    icon: "Dining",
    notes: "",
  },
  {
    id: "9",
    name: "Uber",
    category: "Transport",
    amount: "1600",
    date: "2026-05-04",
    type: "debit",
    icon: "Transport",
    notes: "",
  },
  {
    id: "10",
    name: "Konga order",
    category: "Other",
    amount: "12000",
    date: "2026-05-03",
    type: "debit",
    icon: "Groceries",
    notes: "Phone case",
  },
];

export default function TransactionsPage() {
  const [rows, setRows] = useState<TxRow[]>(seed);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TxRow | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || r.category === category;
      const matchFrom = !dateFrom || r.date >= dateFrom;
      const matchTo = !dateTo || r.date <= dateTo;
      return matchSearch && matchCat && matchFrom && matchTo;
    });
  }, [rows, search, category, dateFrom, dateTo]);

  const totals = useMemo(() => {
    const income = filtered
      .filter((r) => r.type === "credit")
      .reduce((s, r) => s + Number(r.amount), 0);
    const expense = filtered
      .filter((r) => r.type === "debit")
      .reduce((s, r) => s + Number(r.amount), 0);
    return { income, expense };
  }, [filtered]);

  const handleSave = (data: TransactionFormData) => {
    if (data.id) {
      setRows((p) =>
        p.map((r) =>
          r.id === data.id ? { ...r, ...data, icon: data.category } : r,
        ),
      );
    } else {
      const newRow: TxRow = {
        ...data,
        id: String(Date.now()),
        icon: data.category,
      };
      setRows((p) => [newRow, ...p]);
    }
  };

  const handleDelete = (id: string) =>
    setRows((p) => p.filter((r) => r.id !== id));

  const handleEdit = (row: TxRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <>
      <div className="space-y-5 max-w-300 mx-auto animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#0a1a14] text-lg font-semibold">
              Transactions
            </h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e7eb] rounded-xl text-xs text-[#6b7280] hover:bg-white transition-all">
              <Download size={13} />
              Export
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={13} />
              Add transaction
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total income",
              value: `₦${totals.income.toLocaleString()}`,
              color: "text-[#0F6E56]",
            },
            {
              label: "Total expenses",
              value: `₦${totals.expense.toLocaleString()}`,
              color: "text-[#0a1a14]",
            },
            {
              label: "Net",
              value: `₦${(totals.income - totals.expense).toLocaleString()}`,
              color:
                totals.income >= totals.expense ?
                  "text-[#0F6E56]"
                : "text-[#993C1D]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#f0f0ee] rounded-2xl px-5 py-4"
            >
              <p className="text-[#9ca3af] text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <TransactionFilters
          search={search}
          onSearch={setSearch}
          activeCategory={category}
          onCategory={setCategory}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFrom={setDateFrom}
          onDateTo={setDateTo}
          onClear={clearFilters}
        />

        {/* Table */}
        <TransactionTable
          rows={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
