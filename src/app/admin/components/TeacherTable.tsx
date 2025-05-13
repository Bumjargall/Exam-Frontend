"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { deleteByUser, getTeachers } from "@/lib/api";
import { toast } from "sonner";
import UserDialog from "./UserDialog";
import { useEffect } from "react";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone:string;
};

export default function TeacherTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [teacherToDelete, setTeacherToDelete] = React.useState<User | null>(null);

  const refetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await getTeachers();
      setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchTeachers();
  }, []);

  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Бүгдийг сонгох"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Мөр сонгох"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "Овог",
    },
    {
      accessorKey: "lastName",
      header: "Нэр",
    },
    {
      accessorKey: "phone",
      header: "Утас",
    },
    {
      accessorKey: "email",
      header: "Имэйл",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      id: "actions",
      header: "Үйлдэл",
      enableHiding: false,
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
      

              <DropdownMenuItem onClick={() => {
                setSelectedTeacher(teacher);
                setEditDialogOpen(true);
              }}>
                Засах
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setTeacherToDelete(teacher);
                setConfirmOpen(true);
              }}>
                Устгах
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Filter */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Имэйлээр шүүх..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Баганууд <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Үр дүн олдсонгүй.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} сонгогдсон.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Өмнөх
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Дараах
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {selectedTeacher && (
        <UserDialog
          open={editDialogOpen}
          onClose={()=>setEditDialogOpen(false)}
          user={selectedTeacher}
          onSaveSuccess={() => {
            setEditDialogOpen(false);
            refetchTeachers();
          }}
        />
      )}

      {/* Delete User Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Устгахдаа итгэлтэй байна уу? </DialogTitle>
            <DialogDescription>
              Та энэ <b>{teacherToDelete?.lastName} </b>хэрэглэгчийг бүрмөсөн устгах гэж байна. 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Болих
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (teacherToDelete) {
                  try {
                    await deleteByUser(teacherToDelete._id);
                    toast.success("Хэрэглэгч амжилттай устгалаа.");
                    setConfirmOpen(false);
                    setTeacherToDelete(null);
                    refetchTeachers();
                  } catch {
                    toast.error("Устгах үед алдаа гарлаа.");
                  }
                }
              }}
            >
              Тийм, устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
