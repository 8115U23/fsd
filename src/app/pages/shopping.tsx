import { useState, useEffect } from "react";
import { ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Plus, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

export function ShoppingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Item form state
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("General");
  const [itemQty, setItemQty] = useState("1");

  // Add Expense form state
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");

  // Budget derived from expenses
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = { total: 2000, spent: totalSpent, remaining: 2000 - totalSpent };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, expensesData] = await Promise.all([
          api.shopping.getAll(),
          api.expenses.getAll()
        ]);
        setItems(itemsData);
        setExpenses(expensesData);
      } catch (err) {
        console.error("Failed to fetch shopping data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.shopping.create({
        name: itemName,
        category: itemCategory,
        quantity: itemQty,
        isPurchased: false,
      });
      setItems(prev => [...prev, data]);
      setIsItemDialogOpen(false);
      setItemName("");
      setItemQty("1");
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryIcons: Record<string, string> = {
      Food: "🛒", Health: "💪", Bills: "⚡", Shopping: "🛍️", Transport: "🚗", Other: "💰"
    };
    try {
      const newExpense = {
        name: expenseName,
        amount: parseFloat(expenseAmount) || 0,
        category: expenseCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        icon: categoryIcons[expenseCategory] || "💰",
      };
      const data = await api.expenses.create(newExpense);
      setExpenses(prev => [data, ...prev]);
      setIsExpenseDialogOpen(false);
      setExpenseName("");
      setExpenseAmount("");
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Failed to add expense. Please try again.");
    }
  };

  const toggleItem = async (id: string, isPurchased: boolean) => {
    try {
      const data = await api.shopping.update(id, { isPurchased });
      setItems(items.map(item => item._id === id ? { ...item, isPurchased } : item));
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Shopping & Expenses</h1>
        <p className="text-muted-foreground">Track your purchases and budget</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold">${budget.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-3xl font-bold text-[#f59e0b]">${budget.spent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-3xl font-bold text-[#10b981]">${budget.remaining}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{((budget.spent / budget.total) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(budget.spent / budget.total) * 100} className="h-3" />
          </div>
          
          {budget.spent / budget.total > 0.8 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
              <p className="text-sm font-medium text-[#f59e0b]">
                You've used over 80% of your monthly budget. Consider reducing spending.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grocery Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#6366f1]" />
                Grocery List
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsItemDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-center py-10 text-muted-foreground">Loading items...</p>
            ) : items.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">No items in your list.</p>
            ) : (
              items.map((item: any) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Checkbox 
                    checked={item.isPurchased} 
                    onCheckedChange={(checked) => toggleItem(item._id, !!checked)}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.isPurchased ? "line-through text-muted-foreground" : ""}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  {item.isPurchased && <Check className="w-4 h-4 text-[#10b981]" />}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#10b981]" />
                Recent Expenses
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsExpenseDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenses.map((expense, i) => (
              <div
                key={expense._id || expense.id || i}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-xl">
                    {expense.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{expense.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                      <span className="text-xs text-muted-foreground">{expense.date}</span>
                    </div>
                  </div>
                </div>
                <p className="font-bold">${expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Spending by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#a855f7]" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { category: "Food & Dining", amount: 450, color: "#6366f1" },
            { category: "Bills & Utilities", amount: 350, color: "#f59e0b" },
            { category: "Health & Fitness", amount: 200, color: "#10b981" },
            { category: "Shopping", amount: 300, color: "#a855f7" },
            { category: "Transportation", amount: 150, color: "#3b82f6" },
          ].map((item, index) => {
            const percentage = (item.amount / budget.spent) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">${item.amount}</span>
                </div>
                <div className="h-2 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color, width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Grocery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g., Whole milk" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-qty">Quantity</Label>
                <Input id="item-qty" value={itemQty} onChange={e => setItemQty(e.target.value)} placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={itemCategory} onValueChange={setItemCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Produce">Produce</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Add to List</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Description</Label>
              <Input id="expense-name" value={expenseName} onChange={e => setExpenseName(e.target.value)} placeholder="e.g., Grocery Run" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount ($)</Label>
                <Input type="number" step="0.01" id="expense-amount" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Bills">Bills</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">Save Expense</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
