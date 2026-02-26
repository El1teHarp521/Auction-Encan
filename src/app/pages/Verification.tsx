import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Upload, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export function Verification() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
      }));
      setFiles([...files, ...fileArray]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Заявка отправлена</h1>
          <p className="text-muted-foreground mb-8">
            Ваши документы находятся на проверке у администратора. Обычно это занимает до 24 часов.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            Вернуться на главную
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl p-8 border-primary/20 shadow-lg">
        <div className="text-center mb-8">
          <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Верификация аккаунта</h1>
          <p className="text-muted-foreground">
            Загрузите документы для получения доступа к торгам
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-all bg-muted/30">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium mb-1">Нажмите для загрузки или перетащите файлы</p>
              <p className="text-sm text-muted-foreground mb-4">Паспорт (фото) и ИНН</p>
              <Button variant="outline" asChild>
                <span>Выбрать файлы</span>
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Прикрепленные файлы:</h3>
              <div className="grid gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1 h-12 text-lg" disabled={files.length === 0}>
              Отправить документы
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" className="flex-1 h-12">
              Сделать позже
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}