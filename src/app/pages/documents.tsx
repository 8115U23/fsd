import { useState, useEffect } from "react";
import { FileText, Lock, Download, Search, Filter, Upload, Grid, List, Plus, X, Save, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

export function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // New Document Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("Work");
  const [docContent, setDocContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // View/Edit panel
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await api.documents.getAll();
        setDocs(data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: docTitle,
        category: docCategory,
        content: docContent,
        size: `${(new Blob([docContent]).size / 1024).toFixed(1)} KB`,
        locked: false,
      };
      const data = await api.documents.create(payload);
      setDocs(prev => [...prev, data]);
      setIsCreateOpen(false);
      setDocTitle("");
      setDocContent("");
    } catch (err) {
      console.error("Failed to create document:", err);
      alert("Failed to save document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditor = (doc: any) => {
    setEditingDoc(doc);
    setEditTitle(doc.name);
    setEditContent(doc.content || "");
  };

  const handleDownload = (doc: any) => {
    const blob = new Blob([doc.content || doc.name], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name.endsWith('.txt') ? doc.name : `${doc.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
    const matchesSearch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { name: "All", count: docs.length },
    { name: "ID", count: docs.filter(d => d.category === 'ID').length },
    { name: "Certificates", count: docs.filter(d => d.category === 'Certificates').length },
    { name: "Insurance", count: docs.filter(d => d.category === 'Insurance').length },
    { name: "Work", count: docs.filter(d => d.category === 'Work').length },
    { name: "Finance", count: docs.filter(d => d.category === 'Finance').length },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Document Vault</h1>
          <p className="text-muted-foreground">Secure storage for important documents</p>
        </div>
        <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <FileText className="w-8 h-8 mx-auto text-[#6366f1]" />
              <p className="text-3xl font-bold">{docs.length}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Lock className="w-8 h-8 mx-auto text-[#10b981]" />
              <p className="text-3xl font-bold">{docs.filter(d => d.locked).length}</p>
              <p className="text-sm text-muted-foreground">Secured</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto text-2xl">📁</div>
              <p className="text-3xl font-bold">{categories.filter(c => c.count > 0).length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto text-2xl">💾</div>
              <p className="text-3xl font-bold">{docs.reduce((acc, d) => acc + (parseFloat(d.size) || 0), 0).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">MB Used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Tabs defaultValue="grid" className="w-auto">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={category.name === activeCategory ? "default" : "outline"}
            className={category.name === activeCategory ? "bg-[#6366f1] hover:bg-[#6366f1]/90" : ""}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">{category.count}</Badge>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            {docs.length === 0 ? "No documents found. Create one to get started!" : "No documents match your search."}
          </div>
        ) : (
          filteredDocs.map((doc: any) => (
            <Card key={doc._id || doc.id} className="hover:shadow-lg transition-all hover:border-[#6366f1]/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#6366f1]" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{doc.size}</p>
                    </div>
                  </div>
                  {doc.locked && (
                    <Lock className="w-4 h-4 text-[#10b981]" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{doc.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.date || doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditor(doc)}>
                    <Pencil className="w-3 h-3 mr-1" /> View / Edit
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Security Notice */}
      <Card className="border-2 border-[#10b981]/20 bg-gradient-to-r from-[#10b981]/5 to-transparent">
        <CardContent className="p-6 flex items-start gap-4">
          <Lock className="w-6 h-6 text-[#10b981] mt-1" />
          <div>
            <h3 className="font-medium mb-2">End-to-End Encryption</h3>
            <p className="text-sm text-muted-foreground">
              All your documents are encrypted and securely stored. Only you have access to your files.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create Document Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="doc-title">Document Title</Label>
                <Input id="doc-title" value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="e.g., Contract 2025" required />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Category</Label>
                <Select value={docCategory} onValueChange={setDocCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="ID">ID</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Certificates">Certificates</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-content">Content</Label>
              <textarea
                id="doc-content"
                value={docContent}
                onChange={e => setDocContent(e.target.value)}
                placeholder="Start writing your document here..."
                rows={10}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-y focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              />
            </div>
            <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Document"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View / Edit Document Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={(open) => { if (!open) setEditingDoc(null); }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <Input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="text-lg font-bold border-none shadow-none focus-visible:ring-0 px-0 text-xl h-auto"
              />
              <Badge variant="outline">{editingDoc?.category}</Badge>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="Your document content will appear here..."
              className="w-full h-[50vh] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
          <div className="flex gap-2 pt-2 flex-wrap">
            <Button
              className="flex-1 bg-[#6366f1] hover:bg-[#6366f1]/90 text-white"
              onClick={async () => {
                if (!editingDoc) return;
                try {
                  const id = editingDoc._id || editingDoc.id;
                  const updated = await api.documents.update(id, {
                    name: editTitle,
                    content: editContent,
                    size: `${(new Blob([editContent]).size / 1024).toFixed(1)} KB`,
                  });
                  setDocs(prev => prev.map(d => (d._id === id || d.id === id) ? { ...d, ...updated } : d));
                  setEditingDoc(null);
                  alert("Document saved!");
                } catch (err) {
                  console.error("Failed to save:", err);
                  alert("Failed to save document.");
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (editingDoc) handleDownload({ ...editingDoc, name: editTitle, content: editContent });
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setEditingDoc(null)}>
              <X className="w-4 h-4 mr-2" /> Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
